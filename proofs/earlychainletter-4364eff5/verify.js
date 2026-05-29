#!/usr/bin/env node
// Reproducible verification for 0x4364eff50d20ca13ec7ec6e9b0f7529a1f39df3c
// Downloads soljson-v0.1.1+commit.6ff4cd6, compiles MyScheme.sol (optimizer ON),
// and checks the compiled creation + runtime bytecode against the on-chain bytes.
//
//   node verify.js
//
// Exit 0 = exact match.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const SOLJSON_PATH = path.join(__dirname, 'soljson-v0.1.1+commit.6ff4cd6.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve();
    const f = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      res.pipe(f);
      f.on('finish', () => f.close(resolve));
    }).on('error', reject);
  });
}

function loadCompiler(p) {
  const m = require(p);
  // v0.1.1 exposes the legacy single-source compileJSON
  const f = m.cwrap('compileJSON', 'string', ['string', 'number']);
  return (source, optimize) => JSON.parse(f(source, optimize ? 1 : 0));
}

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'MyScheme.sol'), 'utf8');
  const compile = loadCompiler(SOLJSON_PATH);
  const out = compile(source, true); // optimizer ON
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : e.severity || ''))) {
    console.error('compile errors:', out.errors); process.exit(1);
  }
  const c = out.contracts['MyScheme'] || out.contracts[':MyScheme'];
  const creation = (c.bytecode || c.bin).toLowerCase();

  const targetCreation = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const targetRuntime = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();

  const creationMatch = creation === targetCreation;
  const runtimeMatch = creation.includes(targetRuntime);
  const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

  console.log('compiler         : soljson-v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log('creation match   :', creationMatch, '(' + creation.length / 2 + ' bytes)');
  console.log('runtime  match   :', runtimeMatch, '(' + targetRuntime.length / 2 + ' bytes)');
  console.log('creation sha256  :', sha(targetCreation));
  console.log('runtime  sha256  :', sha(targetRuntime));
  process.exit(creationMatch && runtimeMatch ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
