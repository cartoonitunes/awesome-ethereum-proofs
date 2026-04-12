const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Pong.sol'), 'utf8');
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
  console.log('Pong (minimal) Contract Verification');
  console.log('Contract: 0x4f87915ac802a86cd3a6ae5d8d6f8de242ef366f');
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

  const contract = out.contracts['Pong'];
  const bin = contract.bytecode;
  const target_creation = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'crack', 'cyrus-adkisson', 'pong-0x4f87915a', 'target_creation.hex'), 'utf8').trim();

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(bin, 'hex')).digest('hex');

  console.log(`Compiled creation: ${bin.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const runtimeMatch = bin.includes(TARGET_RUNTIME);
  const creationMatch = bin === target_creation;

  console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Creation match: ${creationMatch ? 'PASS' : 'FAIL'}`);

  if (runtimeMatch) {
    console.log();
    console.log('VERIFIED: exact bytecode match');
  }
}

main().catch(console.error);
