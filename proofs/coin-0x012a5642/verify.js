#!/usr/bin/env node
// Reproducible RUNTIME verification for 0x012a5642306b0deb8d65f281d289998223dfb7c7
// Downloads soljson-v0.1.3+commit.028f561d, compiles token.sol (optimizer OFF),
// and checks the compiled runtime bytecode equals the on-chain runtime, byte for byte.
//
//   node verify.js
//
// Exit 0 = exact runtime match.
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

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'token.sol'), 'utf8');
  // pick the legacy interface this build exposes
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'token.sol': source } }), 0); // optimizer OFF
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 0);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['token'] || out.contracts['token.sol:token'];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const target = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const match = runtime === target;
  const sha = crypto.createHash('sha256').update(Buffer.from(target, 'hex')).digest('hex');

  console.log('compiler        : soljson-v0.1.3+commit.028f561d (optimizer OFF)');
  console.log('runtime match   :', match, '(' + target.length / 2 + ' bytes)');
  console.log('runtime sha256  :', sha);
  process.exit(match ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
