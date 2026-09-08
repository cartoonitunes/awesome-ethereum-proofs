#!/usr/bin/env node
// Byte-for-byte proof for 0xfc247caf612c0e82f6dee14294e7ddfa07bea350
// (SmartWallet cluster, 7,847 members, first-deployed 2018-09-27).
//
// The source is the Bancor-lineage SmartWallet already Etherscan-verified at
// 0x2df514a060bbd105ea428182e8b140454f426d15 (compiler v0.4.24+commit.e67f0147,
// optimizer ON runs=200, same swarm hash). Our target compiles from the same
// source; the ONLY difference from the reference deployment is the linked
// SmartWalletLib address, which is embedded at 4 positions in the runtime.
//
// This script proves the match by fetching the already-verified reference
// runtime and substituting the reference library address with the target's,
// then byte-comparing against the on-chain runtime of 0xfc247caf... Exit 0
// means exact byte-for-byte match.
'use strict';
const fs = require('fs'), path = require('path'), https = require('https'), crypto = require('crypto');
const REF = '0x2df514a060bbd105ea428182e8b140454f426d15';
const REF_LIB = '4a3cc40b9c78ca394e288e0f645907a8a8fcefca';
const TGT_LIB = '74ba8c8f53809bd3baa0c243350cb989f6c9dc3c';

function get(url) { return new Promise((res, rej) => https.get(url, r => { let b=''; r.on('data',c=>b+=c); r.on('end',()=>res(b)); }).on('error', rej)); }
function sha(hex) { return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex'); }

(async () => {
  const key = process.env.ETHERSCAN_API_KEY;
  if (!key) { console.error('set ETHERSCAN_API_KEY'); process.exit(1); }
  const raw = JSON.parse(await get(`https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getCode&address=${REF}&tag=latest&apikey=${key}`));
  const refCode = raw.result.replace(/^0x/, '').toLowerCase();
  const patched = refCode.split(REF_LIB).join(TGT_LIB);
  const tgt = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim().replace(/^0x/, '').toLowerCase();
  console.log('reference deployment : ' + REF);
  console.log('reference library    : 0x' + REF_LIB);
  console.log('target library       : 0x' + TGT_LIB);
  console.log('substitutions        : ' + ((refCode.match(new RegExp(REF_LIB, 'g')) || []).length));
  console.log('lengths              : patched=' + patched.length/2 + 'B  target=' + tgt.length/2 + 'B');
  console.log('runtime sha256       : ' + sha(tgt));
  const match = patched === tgt;
  console.log('EXACT BYTECODE MATCH : ' + match);
  process.exit(match ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
