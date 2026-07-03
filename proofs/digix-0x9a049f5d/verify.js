#!/usr/bin/env node
// Verify Digix reproduces on-chain bytecode byte-for-byte.
// Usage: npm i solc@0.4.26 && node verify.js
// Downloads soljson-v0.1.1+commit.6ff4cd6 if not present in ./ or /tmp/soljson/.
const fs = require('fs'), https = require('https'), path = require('path');
const VER = 'soljson-v0.1.1+commit.6ff4cd6.js';
const OPT = 1, CNAME = 'Digix', SRC = 'Digix.sol', MODE = 'creation';
function findSoljson(cb){
  for (const p of [path.join(__dirname,VER), '/tmp/soljson/'+VER]) if (fs.existsSync(p)) return cb(p);
  const url = 'https://binaries.soliditylang.org/bin/'+VER;
  const dst = path.join(__dirname, VER);
  console.log('downloading', url);
  const f = fs.createWriteStream(dst);
  https.get(url, r => { r.pipe(f); f.on('finish', ()=>f.close(()=>cb(dst))); });
}
findSoljson(soljsonPath => {
  const solc = require('solc');
  const compiler = solc.setupMethods(require(soljsonPath));
  const source = fs.readFileSync(path.join(__dirname, SRC), 'utf8');
  let r = compiler.compile(source, OPT);
  if (typeof r === 'string') r = JSON.parse(r);
  const key = Object.keys(r.contracts).find(k => k.endsWith(CNAME)) || Object.keys(r.contracts)[0];
  const c = r.contracts[key];
  const want = fs.readFileSync(path.join(__dirname, MODE==='runtime'?'target_runtime.txt':'target_creation.txt'),'utf8').trim().replace(/^0x/,'');
  const got = (MODE==='runtime' ? c.runtimeBytecode : c.bytecode) || '';
  console.log(MODE, 'target :', want.length/2, 'bytes');
  console.log(MODE, 'compiled:', got.length/2, 'bytes');
  console.log(got === want ? '✅ EXACT MATCH' : '❌ MISMATCH');
  process.exit(got === want ? 0 : 1);
});
