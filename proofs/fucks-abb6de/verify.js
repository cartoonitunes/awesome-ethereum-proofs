const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Fucks.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.1+commit.91a6b35f.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.2.1.js');

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
  console.log('Fucks Contract Verification');
  console.log('Contract: 0xabb6de07f9aac9d88bd74bd931a8bbbce1a1860d');
  console.log('Compiler: soljson-v0.2.1+commit.91a6b35f (optimizer ON)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1));

  if (out.errors) {
    const fatal = out.errors.filter(e => !e.includes('Warning'));
    if (fatal.length) {
      console.log('COMPILE ERRORS:', fatal);
      process.exit(1);
    }
  }

  const contract = out.contracts['MyToken'];
  const bin = contract.bytecode;
  const runtime = contract.runtimeBytecode;

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const targetHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');

  console.log(`Compiled runtime: ${runtime.length / 2} bytes`);
  console.log(`Target runtime:   ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Compiled SHA-256: ${runtimeHash}`);
  console.log(`Target SHA-256:   ${targetHash}`);
  console.log();

  const exact = runtime === TARGET_RUNTIME;
  console.log(`Runtime match: ${exact ? 'PASS (exact)' : 'FAIL'}`);
  if (exact) {
    console.log();
    console.log('VERIFIED: exact bytecode match');
  } else {
    process.exit(1);
  }
}

main().catch(console.error);
