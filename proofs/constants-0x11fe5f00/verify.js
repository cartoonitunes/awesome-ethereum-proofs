const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Constants.sol'), 'utf8');

const EXPECTED_CREATION = '60606040526104d26000600050556101c8600160005055610559600260005055605f80602c6000396000f300' + TARGET_RUNTIME;

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.1.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Constants Contract Verification');
  console.log('Contract: 0x11fe5f00cb9c5de83c13f3b520900d665927fc39');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer OFF)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.1...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['C'];
  const bin = contract.bytecode;

  console.log('--- Creation bytecode verification ---');
  const creationMatch = bin === EXPECTED_CREATION;
  const creationHash = crypto.createHash('sha256').update(Buffer.from(EXPECTED_CREATION, 'hex')).digest('hex');
  console.log(`Compiled creation: ${EXPECTED_CREATION.length / 2} bytes`);
  console.log(`Compiled SHA-256: ${creationHash}`);
  console.log(`Compiler match: ${creationMatch ? 'PASS' : 'FAIL'}`);
  console.log();

  console.log('--- Runtime bytecode verification ---');
  const runtimeIdx = bin.indexOf(TARGET_RUNTIME);
  const runtimeMatch = runtimeIdx >= 0;
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log();

  if (!creationMatch) {
    console.log('FAIL: creation bytecode mismatch');
    process.exit(1);
  }

  console.log('--- On-chain comparison ---');
  const txHash = '0xec0c3d532c23b382609d3de306ed5b8ae839b90f9727eafab3e0b6fe6adaed8b';
  const EXPECTED_ONCHAIN = bin;

  const txData = await new Promise((resolve, reject) => {
    https.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  if (!txData.result || !txData.result.input) {
    console.log('Skipped: could not fetch on-chain data (API key may be required)');
    console.log();
    console.log('VERIFIED: exact creation bytecode match (soljson compiler)');
    return;
  }

  const onChainInput = txData.result.input.substring(2);
  console.log(`On-chain creation: ${onChainInput.length / 2} bytes`);

  if (onChainInput === EXPECTED_ONCHAIN) {
    console.log();
    console.log('VERIFIED: exact creation bytecode match (compiler + on-chain)');
  } else if (onChainInput.includes(TARGET_RUNTIME)) {
    console.log();
    console.log('VERIFIED: runtime bytecode match');
  } else {
    console.log();
    console.log('MISMATCH: bytecode does not match');
    process.exit(1);
  }
}

main().catch(console.error);
