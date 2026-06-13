#!/usr/bin/env node
// Reproducible verification for 0x1BF963724A03dd8649950133eAE1f3F0e0c9CAAb
// Downloads soljson-v0.2.0+commit.4dc2445e, compiles mytoken.sol (optimizer ON), checks bytecode byte-for-byte.
//   node verify.js   -> exit 0 = match
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.2.0+commit.4dc2445e.js';
const P=path.join(__dirname,'soljson-v0.2.0+commit.4dc2445e.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);
https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(h){return crypto.createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'mytoken.sol'),'utf8');
  let raw;
  if(typeof m._compileJSONMulti==='function'){raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'mytoken.sol':src}}),1);}
  else{raw=m.cwrap('compileJSON','string',['string','number'])(src,1);}
  const out=JSON.parse(raw);
  if(out.errors&&out.errors.some(e=>/error/i.test(typeof e==='string'?e:e.severity||''))){console.error(out.errors);process.exit(1);}
  const c=out.contracts['MyToken']||out.contracts['mytoken.sol:MyToken'];
  const rt=(c.runtimeBytecode||c['bin-runtime']).toLowerCase();
  const tRt=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const rOk=rt===tRt;
  console.log('compiler        : soljson-v0.2.0+commit.4dc2445e (optimizer ON)');
  console.log('runtime  match  :',rOk,'('+tRt.length/2+' bytes, sha256 '+sha(tRt)+')');
  let cOk=true;
  
  process.exit(rOk&&cOk?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
