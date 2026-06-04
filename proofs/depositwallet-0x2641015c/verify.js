const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'DepositWallet.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.3+commit.028f561d.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.3.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file); file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('DepositWallet Verification');
  console.log('Compiler: soljson-v0.1.3+commit.028f561d (optimizer OFF)\n');
  if (!fs.existsSync(COMPILER_FILE)) { console.log('Downloading compiler...'); await download(COMPILER_URL, COMPILER_FILE); }
  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));
  if (out.errors) { console.log('COMPILE ERRORS:', out.errors); process.exit(1); }
  const bin = out.contracts['DepositWallet'].bytecode.toLowerCase();
  const ok = bin.includes(TARGET_RUNTIME);
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log('Runtime: ' + TARGET_RUNTIME.length / 2 + ' bytes');
  console.log('Runtime SHA-256: ' + runtimeHash);
  console.log('Runtime match: ' + (ok ? 'PASS' : 'FAIL'));
  console.log(ok ? '\nVERIFIED: exact runtime bytecode match' : '\nFAILED');
  process.exit(ok ? 0 : 1);
}
main().catch(console.error);
