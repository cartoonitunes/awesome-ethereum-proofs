#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for 0x012D89Ac787BeDdf0f03e269e4B7D70B33e17890
// Downloads soljson-v0.3.0+commit.11d67369, compiles small.sol (optimizer ON), extracts the
// `Small` contract, and checks its compiled runtime and creation bytecode equal the on-chain
// bytecode, byte for byte. The deploy-tx input appends a 32-byte ABI-encoded `bigAddress`
// constructor argument, which this script strips before comparing creation.
//
//   node verify.js
//
// Exit 0 = exact runtime AND creation (init+runtime) match.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.3.0+commit.11d67369.js';
const SOLJSON_PATH = path.join(__dirname, 'soljson-v0.3.0+commit.11d67369.js');

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
  const source = fs.readFileSync(path.join(__dirname, 'small.sol'), 'utf8');
  let raw;
  if (typeof m._compileJSONMulti === 'function') {
    const f = m.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    raw = f(JSON.stringify({ sources: { 'small.sol': source } }), 1); // optimizer ON
  } else {
    const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
    raw = f(source, 1);
  }
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const key = Object.keys(out.contracts).find(k => k === 'Small' || k.endsWith(':Small'));
  const c = out.contracts[key];
  const runtime = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const creation = (c.bytecode || c.bin).toLowerCase();
  const tRuntime = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const tCreationFull = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  // strip the trailing 32-byte ABI-encoded bigAddress constructor argument
  const ctorArg = tCreationFull.slice(-64);
  const tCreation = tCreationFull.slice(0, tCreationFull.length - 64);
  const rOk = runtime === tRuntime, cOk = creation === tCreation;

  console.log('compiler        : soljson-v0.3.0+commit.11d67369 (optimizer ON)');
  console.log('runtime  match  :', rOk, '(' + tRuntime.length / 2 + ' bytes, sha256 ' + sha(tRuntime) + ')');
  console.log('creation match  :', cOk, '(' + tCreation.length / 2 + ' bytes init+runtime, +32B ctor arg)');
  console.log('constructor arg : 0x' + ctorArg.slice(24) + ' (bigAddress)');
  process.exit(rOk && cOk ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
