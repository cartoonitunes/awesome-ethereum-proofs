#!/usr/bin/env node
// Reproducible verification for 0x04002735cEB631FC72f9cAF4c1Cb9A9806A9d74d
// Downloads soljson-v0.1.5+commit.23865e39, compiles simplestorage.sol (optimizer OFF), checks bytecode byte-for-byte.
//   node verify.js   -> exit 0 = match
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.1.5+commit.23865e39.js';
const P=path.join(__dirname,'soljson-v0.1.5+commit.23865e39.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);
https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(h){return crypto.createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'simplestorage.sol'),'utf8');
  let raw;
  if(typeof m._compileJSONMulti==='function'){raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'simplestorage.sol':src}}),0);}
  else{raw=m.cwrap('compileJSON','string',['string','number'])(src,0);}
  const out=JSON.parse(raw);
  if(out.errors&&out.errors.some(e=>/error/i.test(typeof e==='string'?e:e.severity||''))){console.error(out.errors);process.exit(1);}
  const c=out.contracts['SimpleStorage']||out.contracts['simplestorage.sol:SimpleStorage'];
  const rt=(c.runtimeBytecode||c['bin-runtime']).toLowerCase();
  const tRt=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const rOk=rt===tRt;
  console.log('compiler        : soljson-v0.1.5+commit.23865e39 (optimizer OFF)');
  console.log('runtime  match  :',rOk,'('+tRt.length/2+' bytes, sha256 '+sha(tRt)+')');
  let cOk=true;
  const cr=(c.bytecode||c.bin).toLowerCase();
  const tCr=fs.readFileSync(path.join(__dirname,'target_creation.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  cOk=cr===tCr;
  console.log('creation match  :',cOk,'('+tCr.length/2+' bytes, sha256 '+sha(tCr)+')');
  process.exit(rOk&&cOk?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
