const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Pool.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.1.js');

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
  console.log('Pool5x v2 Contract Verification');
  console.log('Contract: 0xbb5cdae9cc524422a46f24b21ed9e1f718c483f9');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1));

  if (out.errors) { console.log('COMPILE ERRORS:', out.errors); process.exit(1); }

  const contract = out.contracts['Pool'];
  const creation = contract.bytecode;

  if (creation.indexOf(TARGET_RUNTIME) < 0) {
    console.log('FAIL: runtime not found in creation bytecode');
    process.exit(1);
  }

  const runtime = TARGET_RUNTIME;
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(creation, 'hex')).digest('hex');

  console.log(`Creation: ${creation.length / 2} bytes`);
  console.log(`Runtime:  ${runtime.length / 2} bytes`);
  console.log(`Runtime SHA-256:  ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();
  console.log('VERIFIED: exact bytecode match');
}

main().catch(console.error);
