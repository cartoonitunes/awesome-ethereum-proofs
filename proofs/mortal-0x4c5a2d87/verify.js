const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Mortal.sol'), 'utf8');

const EXPECTED_CREATION = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b60d58061003f6000396000f300' + TARGET_RUNTIME;

const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.1.js');

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
  console.log('Mortal Contract Verification');
  console.log('Contract: 0x4c5a2d876421bcf8518c34778b652a63d463b56e');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer OFF)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0)); // optimizer OFF

  if (out.errors) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['Mortal'];
  const bin = contract.bytecode;

  // Find runtime in creation bytecode
  const runtimeStart = bin.indexOf(TARGET_RUNTIME);
  if (runtimeStart < 0) {
    console.log('FAIL: runtime not found in creation bytecode');
    process.exit(1);
  }

  const init = bin.substring(0, runtimeStart);
  const runtime = TARGET_RUNTIME;

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(bin, 'hex')).digest('hex');

  console.log(`Init: ${init.length / 2} bytes`);
  console.log(`Runtime: ${runtime.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const runtimeMatch = bin.includes(TARGET_RUNTIME);
  console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log();

  // Verify full creation bytecode against expected
  console.log('--- Full creation verification ---');
  if (bin === EXPECTED_CREATION) {
    console.log('Creation bytecode match: PASS');
  } else {
    console.log('Creation bytecode match: FAIL');
    let diffs = 0;
    for (let i = 0; i < Math.min(bin.length, EXPECTED_CREATION.length); i += 2) {
      if (bin.substring(i, i + 2) !== EXPECTED_CREATION.substring(i, i + 2)) diffs++;
    }
    console.log(`${diffs} byte differences`);
  }
  console.log();

  // Fetch on-chain creation tx and compare
  console.log('--- On-chain comparison ---');
  console.log('Fetching on-chain creation bytecode...');

  const txData = await new Promise((resolve, reject) => {
    https.get('https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=0x0ba21f87f6715cace68d6929f93b4dc6b94e04c4e57ffe876c64007bc45b6e32', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const onChainInput = txData.result.input.substring(2); // remove 0x

  console.log(`On-chain creation: ${onChainInput.length / 2} bytes`);

  if (onChainInput === EXPECTED_CREATION) {
    console.log();
    console.log('VERIFIED: exact creation bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH: creation bytecode does not match');
    let diffs = 0;
    for (let i = 0; i < Math.min(onChainInput.length, EXPECTED_CREATION.length); i += 2) {
      if (onChainInput.substring(i, i + 2) !== EXPECTED_CREATION.substring(i, i + 2)) diffs++;
    }
    console.log(`${diffs} byte differences`);
    process.exit(1);
  }
}

main().catch(console.error);
