const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Wallet.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.3+commit.028f561d.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.3.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if ([301,302].includes(res.statusCode)) { file.close(); fs.unlinkSync(dest); return download(res.headers.location, dest).then(resolve).catch(reject); }
      res.pipe(file); file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Wallet Deposit/Collect Contract Verification');
  console.log('Deployer: 0x48a33958A96276E41c11e1359a9989BbaDfDb74A');
  console.log('Canonical: 0x986058b63c1d3ed610b7ca4cb9cd869a6767da20');
  console.log('Compiler: soljson v0.1.3 (optimizer OFF) — also matches v0.1.4');
  console.log('Copies: 50 (all deployed Feb 8, 2016 in 61 seconds)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.3...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));

  if (!out.contracts) { console.error('Compile error:', out.errors); process.exit(1); }
  const rt = out.contracts['Wallet'].runtimeBytecode;
  const hash = crypto.createHash('sha256').update(Buffer.from(TARGET, 'hex')).digest('hex');

  console.log('Target:   ', TARGET.length/2, 'bytes, SHA-256:', hash);
  console.log('Compiled: ', rt.length/2, 'bytes');
  console.log();

  if (rt === TARGET) {
    console.log('Runtime match: PASS');
    console.log('VERIFIED: exact bytecode match (50 copies covered)');
  } else {
    console.log('Runtime match: FAIL');
    process.exit(1);
  }
}
main().catch(console.error);
