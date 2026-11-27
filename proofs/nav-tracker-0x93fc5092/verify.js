// NAV Tracker (0x93fc50922d4ab63300abf7378a5b9196c2a15da1) - warm-session verification.
//
// The on-chain bytecode is what soljson v0.2.2+commit.ef92f566 (optimizer ON) produces on the
// 6th compile of Nav.sol within ONE soljson session. A fresh single compile is 117 bytes off
// (only the scheduling of two independent SLOADs in get() / getHistory differs). This script
// loads soljson once, compiles the same source six times, prints each compile's diff against
// the on-chain runtime, and requires compile #6 to match runtime AND creation exactly.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '');
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim().replace(/^0x/, '');
const SOURCE = fs.readFileSync(path.join(__dirname, 'Nav.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.2+commit.ef92f566.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.2.2.js');
const COMPILES = 6;            // the matching compile number within one session
const CTOR_ARGS_BYTES = 128;   // 4 ABI-encoded constructor arguments follow the init code

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

function byteDiff(a, b) {
  let d = Math.abs(a.length - b.length) / 2;
  for (let i = 0; i < Math.min(a.length, b.length); i += 2) if (a.substr(i, 2) !== b.substr(i, 2)) d++;
  return d;
}

const sha = hex => crypto.createHash('sha256').update(Buffer.from(hex, 'hex')).digest('hex');

async function main() {
  console.log('NAV Tracker verification (0x93fc50922d4ab63300abf7378a5b9196c2a15da1)');
  console.log('Compiler: soljson-v0.2.2+commit.ef92f566 (optimizer ON), compile #' + COMPILES + ' of one session');
  if (!fs.existsSync(SOLJSON_FILE)) { console.log('Downloading compiler...'); await download(SOLJSON_URL, SOLJSON_FILE); }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);

  let last = null;
  for (let i = 1; i <= COMPILES; i++) {
    const out = JSON.parse(compile(SOURCE, 1));
    if (!out.contracts) { console.log('COMPILE ERRORS:', out.errors); process.exit(1); }
    last = out.contracts['Nav'] || out.contracts[':Nav'];
    console.log(`  compile #${i}: runtime ${byteDiff(last.runtimeBytecode, TARGET_RUNTIME)} bytes off`);
  }

  const runtimeOk = last.runtimeBytecode === TARGET_RUNTIME;
  const creationOk = TARGET_CREATION.startsWith(last.bytecode) &&
                     TARGET_CREATION.length / 2 === last.bytecode.length / 2 + CTOR_ARGS_BYTES;
  console.log(`Runtime (compile #${COMPILES}):  ${runtimeOk ? 'PASS' : 'FAIL'}  sha256 ${sha(last.runtimeBytecode)}`);
  console.log(`Creation (compile #${COMPILES}): ${creationOk ? 'PASS' : 'FAIL'}  init ${last.bytecode.length / 2}B + ${CTOR_ARGS_BYTES}B constructor args`);

  if (runtimeOk && creationOk) console.log('VERIFIED: exact bytecode match (init + runtime) on compile #' + COMPILES + ' of one session');
  else { console.log('MISMATCH'); process.exit(1); }
}

main().catch(err => { console.error(err); process.exit(1); });
