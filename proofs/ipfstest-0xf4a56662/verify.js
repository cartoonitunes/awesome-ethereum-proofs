const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'IPFSTest.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.0+commit.4dc2445e.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.2.0.js');

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
  console.log('IPFSTest Contract Verification');
  console.log('Contract: 0xf4a56662f39664a19a73a48ff4ef8cdebd90bc6f');
  console.log('Compiler: soljson-v0.2.0+commit.4dc2445e (optimizer ON)');
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

  const contract = out.contracts['IPFSTest'];
  const creation = contract.bytecode;
  const runtime = contract.runtimeBytecode;

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(creation, 'hex')).digest('hex');

  console.log(`Creation: ${creation.length / 2} bytes`);
  console.log(`Runtime:  ${runtime.length / 2} bytes`);
  console.log(`Runtime SHA-256:  ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const runtimeMatch = runtime === TARGET_RUNTIME;
  const creationMatch = creation === TARGET_CREATION;

  console.log(`Runtime match:  ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Creation match: ${creationMatch ? 'PASS' : 'FAIL'}`);

  if (runtimeMatch && creationMatch) {
    console.log();
    console.log('VERIFIED: exact bytecode match (init + runtime)');
  } else {
    process.exit(1);
  }
}

main().catch(console.error);
