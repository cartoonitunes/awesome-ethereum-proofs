#!/usr/bin/env node
// Reproducible RUNTIME verification for 0x29b973bc5ed4457ddfe2d0e929183ab46ab44ba3 (DAO Wars Board).
// Board was created internally by the Game contract 0x143c31b0 (`new Board(...)`), so there is no
// standalone creation transaction; the runtime is checked byte-for-byte.
// Downloads soljson-v0.1.6+commit.d41f8b7c, compiles Game.sol (optimizer ON), selects contract Board.
//   node verify.js      exit 0 = exact runtime match
'use strict';
const fs = require('fs'), path = require('path'), https = require('https'), crypto = require('crypto');
const SOLJSON = 'soljson-v0.1.6+commit.d41f8b7c.js';
const P = path.join(__dirname, SOLJSON);
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
  await download('https://binaries.soliditylang.org/bin/' + SOLJSON, P);
  const m = require(P);
  const src = fs.readFileSync(path.join(__dirname, 'Game.sol'), 'utf8');
  const out = JSON.parse(m.cwrap('compileJSON', 'string', ['string', 'number'])(src, 1));
  const rt = out.contracts.Board.runtimeBytecode.toLowerCase();
  const target = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const sha = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');
  console.log('compiler      : soljson-v0.1.6+commit.d41f8b7c (optimizer ON), contract Board');
  console.log('runtime match :', rt === target, '(' + target.length / 2 + ' bytes)  sha256', sha(target));
  process.exit(rt === target ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
