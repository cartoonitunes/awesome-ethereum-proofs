const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const SOURCE = fs.readFileSync(path.join(__dirname, 'PriceTicker.sol'), 'utf8');
const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.6.js');

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

const sha = hex => crypto.createHash('sha256').update(Buffer.from(hex, 'hex')).digest('hex');

async function main() {
  console.log('PriceTicker Verification');
  console.log('Contract: 0x29599b97021154edee168420a5c64e818ee5660b');
  console.log('Compiler: soljson-v0.1.6+commit.d41f8b7c (optimizer OFF)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));
  if (out.errors) {
    const fatal = out.errors.filter(e => !e.includes('Warning'));
    if (fatal.length) { console.log('COMPILE ERRORS:', fatal); process.exit(1); }
  }

  const c = out.contracts['PriceTicker'];
  const runtime = c.runtimeBytecode;
  const creation = c.bytecode;
  console.log(`Runtime:  ${runtime.length / 2} bytes, SHA-256 ${sha(runtime)}`);
  console.log(`Target:   ${TARGET_RUNTIME.length / 2} bytes, SHA-256 ${sha(TARGET_RUNTIME)}`);
  console.log(`Creation: ${creation.length / 2} bytes, SHA-256 ${sha(creation)}`);
  console.log(`Target:   ${TARGET_CREATION.length / 2} bytes, SHA-256 ${sha(TARGET_CREATION)}`);
  console.log();
  const ok = runtime === TARGET_RUNTIME && creation === TARGET_CREATION;
  console.log(`Runtime match:  ${runtime === TARGET_RUNTIME ? 'PASS (exact)' : 'FAIL'}`);
  console.log(`Creation match: ${creation === TARGET_CREATION ? 'PASS (exact)' : 'FAIL'}`);
  if (!ok) process.exit(1);
  console.log();
  console.log('VERIFIED: exact bytecode match');
}

main().catch(console.error);
