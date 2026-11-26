const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'ObamaOracle.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.6.js');
const ADDRESS = '0x66c67a9e26f5f1bf04c0e8797a4ae2f01db5785a';

const EXPECTED_RUNTIME_SHA = 'e7f7fdaef29a4192b53e23dbe6af3dbb92db00c5af293e95e7bfe6c02232b50e';
const EXPECTED_CREATION_SHA = '1bc2e573bf5eab0a7a259472109138eca7c415631bbfb23ed416bd52645d05e8';
const EXACT_CREATION = true; // false when the contract has constructor args

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('ObamaOracle verification (0x66c67a9e26f5f1bf04c0e8797a4ae2f01db5785a)');
  console.log('Compiler: soljson-v0.1.6+commit.d41f8b7c (optimizer OFF)');
  if (!fs.existsSync(SOLJSON_FILE)) { console.log('Downloading compiler...'); await download(SOLJSON_URL, SOLJSON_FILE); }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));
  if (out.errors && !out.contracts) { console.log('COMPILE ERRORS:', out.errors); process.exit(1); }

  const contract = out.contracts['ObamaOracle'] || out.contracts[':ObamaOracle'];
  const compiledBin = contract.bytecode;
  if (compiledBin.indexOf(TARGET_RUNTIME) < 0) { console.log('FAIL: runtime not in compiled output'); process.exit(1); }

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledBin, 'hex')).digest('hex');

  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  const onChainOk = EXACT_CREATION ? (compiledBin === TARGET_CREATION) : TARGET_CREATION.startsWith(compiledBin);
  console.log(`Runtime match:     ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation SHA:      ${creationOk ? 'PASS' : 'FAIL'}`);
  console.log(`On-chain creation: ${onChainOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk && onChainOk) console.log('VERIFIED: exact bytecode match (init + runtime)');
  else { console.log('MISMATCH'); process.exit(1); }
}

main().catch(err => { console.error(err); process.exit(1); });
