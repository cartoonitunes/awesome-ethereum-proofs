const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'EthXbt.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.6.js');
const ADDRESS = '0x3c025ceb9fcf6e761f102c58a7f9c00aa9dd3142';
const DEPLOY_TX = '0xb1f265cd37979a4af69d3bf13363f7a4f1ff543042f0d3a0e224c947c1116c09';

const EXPECTED_RUNTIME_SHA = '77a4131967d4b179374fbf73fe5a167782d5cf1c38cefd5c60ef112ac02d3575';
const EXPECTED_CREATION_SHA = '6ce714bd48f1a93b606c0c158a1d7940ad7b3f9c5e28187f9b162d4a478dd30c';

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
  console.log('EthXbt (DEVCON1 Oraclize ticker) Verification');
  console.log(`Contract: ${ADDRESS}`);
  console.log('Compiler: soljson v0.1.6+commit.d41f8b7c (optimizer ON)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.6...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // 1 = optimizer ON

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['EthXbt'] || out.contracts[':EthXbt'];
  const compiledCreation = contract.bytecode;        // full creation (init + runtime)
  const compiledRuntime = contract.runtimeBytecode || '';

  // Runtime: locate the on-chain runtime inside the compiled creation.
  const runtimeIdx = compiledCreation.indexOf(TARGET_RUNTIME);
  if (runtimeIdx < 0) {
    console.log('FAIL: runtime not found in compiled creation output');
    process.exit(1);
  }

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledCreation, 'hex')).digest('hex');

  console.log(`Init: ${runtimeIdx / 2} bytes`);
  console.log(`Runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Compiled creation: ${compiledCreation.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  // The constructor takes no arguments, so the on-chain creation equals the
  // compiler creation output byte-for-byte.
  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  const onChainOk = compiledCreation === TARGET_CREATION;

  console.log(`Runtime match:        ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation SHA match:   ${creationOk ? 'PASS' : 'FAIL'}`);
  console.log(`On-chain creation:    ${onChainOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk && onChainOk) {
    console.log();
    console.log('VERIFIED: exact bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH');
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
