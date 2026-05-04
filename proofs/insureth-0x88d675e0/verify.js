const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Insurance.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.1.js');
const ADDRESS = '0x88d675e08b053404209e6b0461a1b648592cfbaa';
const DEPLOY_TX = '0x0361e347f16fbbf5763cf67aeaa8a655062dd56eb1dba29ccc68a0173a4c8976';

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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('InsurETH Verification');
  console.log(`Contract: ${ADDRESS}`);
  console.log('Compiler: soljson v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.1...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1));

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['Insurance'] || out.contracts[':Insurance'];
  const compiledBin = contract.bytecode;
  const runtimeIdx = compiledBin.indexOf(TARGET_RUNTIME);
  if (runtimeIdx < 0) {
    console.log('FAIL: runtime not found in compiled output');
    process.exit(1);
  }

  const runtime = TARGET_RUNTIME;
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledBin, 'hex')).digest('hex');

  console.log(`Init: ${runtimeIdx / 2} bytes`);
  console.log(`Runtime: ${runtime.length / 2} bytes`);
  console.log(`Compiled creation: ${compiledBin.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const EXPECTED_RUNTIME_SHA = '8603b999321b5a167770cf92b32ecf390e3ec5c7ed9f8aef0a36cd486a96b4a5';
  const EXPECTED_CREATION_SHA = 'db4cf8e59951d3a5ede33b0353c6f15607faec4b36d65a51165acaa7c687fe68';

  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  console.log(`Runtime match:  ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation match: ${creationOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk) {
    console.log();
    console.log('VERIFIED: exact creation bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH against expected SHA-256 hashes');
    process.exit(1);
  }

  // Optional: fetch on-chain bytecode for an extra cross-check (requires Etherscan API key)
  const apikey = process.env.ETHERSCAN_API_KEY;
  if (apikey) {
    console.log();
    console.log('Cross-checking against on-chain bytecode...');
    const tx = await fetchJson(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${DEPLOY_TX}&apikey=${apikey}`);
    if (tx.result && tx.result.input) {
      const onChain = tx.result.input.substring(2);
      const onChainSha = crypto.createHash('sha256').update(Buffer.from(onChain, 'hex')).digest('hex');
      console.log(`On-chain SHA-256: ${onChainSha}`);
      console.log(onChain === compiledBin ? 'On-chain match: PASS' : 'On-chain match: FAIL');
    } else {
      console.log('Could not fetch on-chain (etherscan returned no result), skipping');
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
