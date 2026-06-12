#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for 0x00593a33889733F325ac1342dfD226a2d1742D09
// Downloads soljson-v0.1.3+commit.028f561d, compiles coin.sol (optimizer ON), and checks the
// compiled runtime and creation bytecode each equal the on-chain bytecode, byte for byte.
//
//   node verify.js
//
// Exit 0 = exact runtime AND creation match.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.3+commit.028f561d.js';
const SOLJSON_PATH = path.join(__dirname, 'soljson-v0.1.3+commit.028f561d.js');

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

function sha(hex) { return crypto.createHash('sha256').update(Buffer.from(hex, 'hex')).digest('hex'); }

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'coin.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'coin.sol': source } }), 1); // optimizer ON
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 1);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['Coin'] || out.contracts['coin.sol:Coin'];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const creation = (c.bytecode || c.bin).toLowerCase();
  const tRuntime = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const tCreation = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const rOk = runtime === tRuntime, cOk = creation === tCreation;

  console.log('compiler        : soljson-v0.1.3+commit.028f561d (optimizer ON)');
  console.log('runtime  match  :', rOk, '(' + tRuntime.length / 2 + ' bytes, sha256 ' + sha(tRuntime) + ')');
  console.log('creation match  :', cOk, '(' + tCreation.length / 2 + ' bytes, sha256 ' + sha(tCreation) + ')');
  process.exit(rOk && cOk ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
