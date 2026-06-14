#!/usr/bin/env node
// Reproducible RUNTIME verification for 0x010b91B5dF9eC1b97f6E6C329CDdc94A6cCec85b
// Downloads soljson-v0.1.3+commit.028f561d, compiles agreement.sol (optimizer OFF), and checks the
// compiled `Agreement` runtime equals the on-chain bytecode, byte for byte.
//
//   node verify.js
//
// Exit 0 = exact runtime match. (The stored `string` is a constructor-set storage value, so it lives
// off-bytecode; all 115 cluster deployments share this identical runtime regardless of the text.)
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
  const source = fs.readFileSync(path.join(__dirname, 'agreement.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'agreement.sol': source } }), 0); // optimizer OFF
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 0);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const key = Object.keys(out.contracts).find(k => k === 'Agreement' || k.endsWith(':Agreement'));
  const c = out.contracts[key];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const tRuntime = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const rOk = runtime === tRuntime;

  console.log('compiler        : soljson-v0.1.3+commit.028f561d (optimizer OFF)');
  console.log('runtime  match  :', rOk, '(' + tRuntime.length / 2 + ' bytes, sha256 ' + sha(tRuntime) + ')');
  process.exit(rOk ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
