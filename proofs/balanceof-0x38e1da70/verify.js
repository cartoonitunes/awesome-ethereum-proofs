#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for
// 0x38e1da7063094fcca07c11d071372918f741a81a
// Downloads soljson-v0.1.3+commit.028f561d, compiles token.sol (optimizer ON),
// and checks the compiled creation + runtime bytecode equal the on-chain bytes.
//
//   node verify.js
//
// Exit 0 = exact creation + runtime match.
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

function readTarget(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8').trim().replace(/^0x/, '').toLowerCase();
}

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'token.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'token.sol': source } }), 1); // optimizer ON
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 1);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['token'] || out.contracts['token.sol:token'];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const creation = (c.bytecode || c.bin).toLowerCase();
  const tRun = readTarget('target_runtime.txt');
  const tCre = readTarget('target_creation.txt');
  const rMatch = runtime === tRun;
  const cMatch = creation === tCre;
  const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

  console.log('compiler        : soljson-v0.1.3+commit.028f561d (optimizer ON)');
  console.log('runtime match   :', rMatch, '(' + tRun.length / 2 + ' bytes)  sha256', sha(tRun));
  console.log('creation match  :', cMatch, '(' + tCre.length / 2 + ' bytes)  sha256', sha(tCre));
  process.exit(rMatch && cMatch ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
