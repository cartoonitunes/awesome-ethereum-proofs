#!/usr/bin/env node
// Verify Piper Merriam's StringLib reproduces the on-chain bytecode byte-for-byte.
// Two byte-identical deployments: 0x4f830b11… and 0xe6b35563….
// Usage: npm i solc@0.4.26 && node verify.js
const fs = require('fs'), https = require('https'), path = require('path');
const VER = 'soljson-v0.1.5-nightly.2015.10.13+commit.e11e10f8.js';
const OPT = 1, CNAME = 'StringLib', SRC = 'StringLib.sol';
function findSoljson(cb){
  for (const p of [path.join(__dirname,VER), '/tmp/soljson/'+VER]) if (fs.existsSync(p)) return cb(p);
  const url = 'https://binaries.soliditylang.org/bin/'+VER, dst = path.join(__dirname, VER);
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
  let ok = true;
  for (const [mode,file,field] of [['creation','target_creation.txt','bytecode'],['runtime','target_runtime.txt','runtimeBytecode']]) {
    const want = fs.readFileSync(path.join(__dirname,file),'utf8').trim().replace(/^0x/,'');
    const got = (c[field]||'');
    const m = got === want;
    console.log(mode, 'target', want.length/2, 'b | compiled', got.length/2, 'b |', m ? '✅ EXACT' : '❌ MISMATCH');
    ok = ok && m;
  }
  process.exit(ok ? 0 : 1);
});
