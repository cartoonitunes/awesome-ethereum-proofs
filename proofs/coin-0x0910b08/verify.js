#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for
// 0x0910b08DdD031E952b9897c7B94D5C51A2D72a49
// Downloads soljson-v0.1.3+commit.028f561d, compiles coin.sol (optimizer ON),
// checks runtime == on-chain runtime, and creation == on-chain creation minus the
// 32-byte ABI-encoded constructor arg (supply) the deploy tx appends.
//
//   node verify.js
// Exit 0 = exact runtime + creation match.
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
const readHex = (n) => fs.readFileSync(path.join(__dirname, n), 'utf8').trim().replace(/^0x/, '').toLowerCase();

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'coin.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    raw = m.cwrap('compileJSONMulti', 'string', ['string', 'number'])(JSON.stringify({ sources: { 'coin.sol': source } }), 1);
  } else {
    raw = m.cwrap('compileJSON', 'string', ['string', 'number'])(source, 1);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['Coin'] || out.contracts['coin.sol:Coin'];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const creation = (c.bytecode || c.bin).toLowerCase();
  const tRun = readHex('target_runtime.txt');
  const tCreFull = readHex('target_creation.txt');
  const ARG = 64;                            // 32-byte appended constructor arg (supply)
  const tCre = tCreFull.slice(0, tCreFull.length - ARG);
  const arg = tCreFull.slice(tCreFull.length - ARG);
  const rMatch = runtime === tRun;
  const cMatch = creation === tCre;
  const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

  console.log('compiler        : soljson-v0.1.3+commit.028f561d (optimizer ON)');
  console.log('runtime match   :', rMatch, '(' + tRun.length / 2 + ' bytes)  sha256', sha(tRun));
  console.log('creation match  :', cMatch, '(' + tCre.length / 2 + ' bytes, +32B arg)  sha256', sha(tCreFull));
  console.log('constructor arg : 0x' + arg, '(supply =', parseInt(arg, 16) + ', 0 -> default 10000)');
  process.exit(rMatch && cMatch ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
