#!/usr/bin/env node
// Reproducible byte-exact verification for 0x036C643c9406bEEc42427174D7378b90638140e4
// Downloads soljson-v0.1.3+commit.028f561d.js, compiles multiply7.sol (optimizer ON), and asserts the compiled
// CREATION bytecode equals the on-chain deploy bytecode and the compiled RUNTIME
// equals the on-chain runtime (eth_getCode). Exit 0 = exact match.
//   node verify.js
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON = 'soljson-v0.1.3+commit.028f561d.js';
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/' + SOLJSON;
const SOLJSON_PATH = path.join(__dirname, SOLJSON);
const OPTIMIZE = 1;              // 1 = optimizer ON, 0 = OFF
const NAME = 'Multiply7';
const SRC = 'multiply7.sol';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve();
    const f = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      res.pipe(f); f.on('finish', () => f.close(resolve));
    }).on('error', reject);
  });
}
const readHex = (n) => fs.readFileSync(path.join(__dirname, n), 'utf8').trim().replace(/^0x/, '').toLowerCase();
const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, SRC), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    raw = m.cwrap('compileJSONMulti', 'string', ['string', 'number'])(JSON.stringify({ sources: { [SRC]: source } }), OPTIMIZE);
  } else {
    raw = m.cwrap('compileJSON', 'string', ['string', 'number'])(source, OPTIMIZE);   // v0.1.1: single source
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts[NAME] || out.contracts[SRC + ':' + NAME];
  const creation = (c.bytecode || c.bin || '').toLowerCase();
  const runtime = (c.runtimeBytecode || c['bin-runtime'] || '').toLowerCase();   // absent on v0.1.1
  const tCre = readHex('target_creation.txt');
  const tRun = readHex('target_runtime.txt');

  const cMatch = creation === tCre;
  // v0.1.1 emits no runtime field; the runtime is the CODECOPY'd tail of the creation.
  const rMatch = runtime ? runtime === tRun : creation.includes(tRun);

  console.log('compiler       :', SOLJSON, '(' + (OPTIMIZE ? 'optimizer ON' : 'optimizer OFF') + ')');
  console.log('creation match :', cMatch, '(' + tCre.length / 2 + ' bytes)  sha256', sha(tCre));
  console.log('runtime  match :', rMatch, '(' + tRun.length / 2 + ' bytes)  sha256', sha(tRun),
              runtime ? '' : '[substring-of-creation; v0.1.1 emits no runtime field]');
  process.exit(cMatch && rMatch ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
