#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const P=path.join(__dirname,'soljson-v0.1.6+commit.d41f8b7c.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Sender.sol'),'utf8');
  const raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'S.sol':src}}),1);
  const c=Object.entries(JSON.parse(raw).contracts).find(([k])=>k.endsWith('Sender'))[1];
  const rt=(c.runtimeBytecode||c['bin-runtime']||'').toLowerCase();
  const t=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  console.log('exact match:', rt===t);
  process.exit(rt===t?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
