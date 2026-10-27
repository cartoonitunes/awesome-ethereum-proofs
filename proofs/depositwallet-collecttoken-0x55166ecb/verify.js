#!/usr/bin/env node
// Byte-for-byte proof for 0x55166ecb1b5b628b028ec0c0b468b68ea7208b62 (Poloniex-style
// deposit forwarder cluster, 7,123+ members, first-deployed 2017-03-22). Compiles
// DepositWallet.sol with soljson-v0.4.4+commit.4633f3de (optimizer ON) and checks
// both the on-chain runtime and creation bytecode.
//   node verify.js   -> exit 0 = match
'use strict';
const fs = require('fs'), path = require('path'), https = require('https'), crypto = require('crypto');
const URL = 'https://binaries.soliditylang.org/bin/soljson-v0.4.4+commit.4633f3de.js';
const P = path.join(__dirname, 'soljson-v0.4.4+commit.4633f3de.js');

function dl(u, d) {
  return new Promise((res, rej) => {
    if (fs.existsSync(d)) return res();
    const f = fs.createWriteStream(d);
    https.get(u, r => {
      if (r.statusCode !== 200) return rej(new Error('HTTP ' + r.statusCode));
      r.pipe(f);
      f.on('finish', () => f.close(res));
    }).on('error', rej);
  });
}

function sha(hex) { return crypto.createHash('sha256').update(Buffer.from(hex, 'hex')).digest('hex'); }

(async () => {
  await dl(URL, P);
  const m = require(P);
  const src = fs.readFileSync(path.join(__dirname, "DepositWallet.sol"), 'utf8');
  const raw = m.cwrap('compileJSON', 'string', ['string', 'number'])(src, 1);
  const out = JSON.parse(raw);
  if (out.errors && out.errors.some(e => /error/i.test(typeof e === 'string' ? e : (e.severity || '')))) {
    console.error(out.errors); process.exit(1);
  }
  const c = out.contracts['DepositWallet'];
  const rt = (c.runtimeBytecode || c['bin-runtime']).toLowerCase();
  const cr = (c.bytecode || c.bin).toLowerCase();
  const tRt = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const tCr = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  const rOk = rt === tRt;
  const cOk = cr === tCr;
  console.log('compiler        : soljson-v0.4.4+commit.4633f3de (optimizer ON)');
  console.log('runtime  match  :', rOk, '(' + tRt.length / 2 + ' bytes, sha256 ' + sha(tRt) + ')');
  console.log('creation match  :', cOk, '(' + tCr.length / 2 + ' bytes, sha256 ' + sha(tCr) + ')');
  if (!rOk) { console.log('  compiled runtime : ', rt); console.log('  target runtime   : ', tRt); }
  if (!cOk) { console.log('  compiled creation: ', cr); console.log('  target creation  : ', tCr); }
  process.exit(rOk && cOk ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
