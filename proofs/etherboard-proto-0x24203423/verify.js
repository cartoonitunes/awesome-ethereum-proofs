#!/usr/bin/env node
// Reproducible RUNTIME + CREATION verification for 0x242034238b5d9c0001bc06320bb4cfd8d20d8ed4 (Etherboard prototype)
// Downloads soljson-v0.1.6+commit.d41f8b7c, compiles Etherboard.sol (optimizer ON),
// and checks both the runtime and the full creation bytecode byte-for-byte.
//
//   node verify.js
//
// Exit 0 = exact runtime match AND exact creation match (no constructor args).
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SOLJSON = 'soljson-v0.1.6+commit.d41f8b7c.js';
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/' + SOLJSON;
const SOLJSON_PATH = path.join(__dirname, SOLJSON);

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

const readTarget = (n) => fs.readFileSync(path.join(__dirname, n), 'utf8').trim().replace(/^0x/, '').toLowerCase();
const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

(async () => {
  await download(SOLJSON_URL, SOLJSON_PATH);
  const m = require(SOLJSON_PATH);
  const source = fs.readFileSync(path.join(__dirname, 'Etherboard.sol'), 'utf8');
  const out = JSON.parse(m.cwrap('compileJSON', 'string', ['string', 'number'])(source, 1));
  const c = out.contracts && out.contracts['Etherboard'];
  if (!c) { console.error('compile failed:', out.errors); process.exit(1); }
  const runtime = c.runtimeBytecode.toLowerCase();
  const creation = c.bytecode.toLowerCase();
  const tRun = readTarget('target_runtime.txt');
  const tCre = readTarget('target_creation.txt');
  const rMatch = runtime === tRun;
  const cMatch = creation === tCre;
  console.log('compiler       : ' + SOLJSON.replace(/\.js$/, '') + ' (optimizer ON)');
  console.log('runtime match  :', rMatch, '(' + tRun.length / 2 + ' bytes)  sha256', sha(tRun));
  console.log('creation match :', cMatch, '(' + tCre.length / 2 + ' bytes)  sha256', sha(tCre));
  process.exit(rMatch && cMatch ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
