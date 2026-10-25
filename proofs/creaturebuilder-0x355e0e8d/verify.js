#!/usr/bin/env node
// Reproducible verification for 0x355e0e8d3d9132f91bf4891fba6b7e06bfd1f685
//   node verify.js   -> exit 0 = runtime and creation match
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const BUILD='v0.1.6+commit.d41f8b7c', OPT=1, SRC='CreatureBuilder.sol', NAME='CreatureBuilder';
const URL='https://binaries.soliditylang.org/bin/soljson-'+BUILD+'.js';
const P=path.join(__dirname,'soljson-'+BUILD+'.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);
https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
const sha=h=>crypto.createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');
const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8').trim().replace(/^0x/,'').toLowerCase();
(async()=>{
  await dl(URL,P);const m=require(P);
  const out=JSON.parse(m.cwrap('compileJSON','string',['string','number'])(fs.readFileSync(path.join(__dirname,SRC),'utf8'),OPT));
  const c=out.contracts[NAME]; if(!c){console.error(out.errors||out);process.exit(1);}
  const bin=c.bytecode.toLowerCase();
  let rt=(c.runtimeBytecode||'').toLowerCase();
  if(!rt){const x=bin.match(/61(....)8061(....)6000396000f3/);rt=bin.substr(parseInt(x[2],16)*2,parseInt(x[1],16)*2);}
  const tRt=rd('target_runtime.txt'), tCr=rd('target_creation.txt');
  const rOk=rt===tRt, cOk=tCr.startsWith(bin), args=tCr.slice(bin.length);
  console.log('compiler       : soljson-'+BUILD+' (optimizer '+(OPT?'ON':'OFF')+')');
  console.log('runtime match  :',rOk,'('+tRt.length/2+' bytes, sha256 '+sha(tRt)+')');
  console.log('creation match :',cOk,'('+bin.length/2+' bytes compiled'+(args?', then '+args.length/2+' bytes of constructor arguments':'')+')');
  process.exit(rOk&&cOk?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
