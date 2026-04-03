const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'GetSet.sol'), 'utf8');
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
  console.log('GetSet Contract Verification');
  console.log('Contract: 0x77beac0aed3b9e75ee2aba60b3dec66ff47e96c2');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // optimizer ON

  if (out.errors) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['GetSet'];
  const bin = contract.bytecode;

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

  if (runtimeMatch) {
    console.log();
    console.log('VERIFIED: exact bytecode match');
  }
}

main().catch(console.error);
