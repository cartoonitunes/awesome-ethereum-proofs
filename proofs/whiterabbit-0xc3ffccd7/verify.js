#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for
// 0xc3ffccd710676d1bab6e206f14225cb1ba6c684d (White Rabbit, WR)
// Downloads soljson-v0.1.7+commit.b4e666cc, compiles Whiterabbit0xc3ffccd7.sol
// (optimizer ON), and checks the compiled bytecode against the on-chain bytes.
//
//   node verify.js
//
// Runtime is an exact match. The on-chain creation tx is the compiled init code
// followed by 288 bytes of ABI-encoded constructor arguments (deploy input, not
// compiler output), so the compiled creation is checked as a byte-exact PREFIX of
// target_creation.txt with exactly 288 trailing argument bytes.
//
// Exit 0 = exact runtime match AND exact creation-init prefix (+288 arg bytes).
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.7+commit.b4e666cc.js';
const SOLJSON_PATH = path.join(__dirname, 'soljson-v0.1.7+commit.b4e666cc.js');
const CTOR_ARG_BYTES = 288; // 9 ABI words: initialSupply, name, decimals, symbol, centralMinter

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
  const source = fs.readFileSync(path.join(__dirname, 'Whiterabbit0xc3ffccd7.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'Whiterabbit0xc3ffccd7.sol': source } }), 1); // optimizer ON
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 1);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['Whiterabbit0xc3ffccd7'] ||
            out.contracts['Whiterabbit0xc3ffccd7.sol:Whiterabbit0xc3ffccd7'];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const creation = (c.bytecode || c.bin).toLowerCase();
  const tRun = readTarget('target_runtime.txt');
  const tCre = readTarget('target_creation.txt');

  const rMatch = runtime === tRun;
  const initPrefix = tCre.slice(0, creation.length);
  const argTail = tCre.slice(creation.length);
  const cMatch = creation === initPrefix && argTail.length === CTOR_ARG_BYTES * 2;
  const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

  console.log('compiler        : soljson-v0.1.7+commit.b4e666cc (optimizer ON)');
  console.log('runtime match   :', rMatch, '(' + tRun.length / 2 + ' bytes)  sha256', sha(tRun));
  console.log('creation init   :', cMatch, '(' + creation.length / 2 + ' bytes init + ' +
              argTail.length / 2 + ' bytes ctor args = ' + tCre.length / 2 + ' on-chain)  sha256', sha(tCre));
  process.exit(rMatch && cMatch ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
