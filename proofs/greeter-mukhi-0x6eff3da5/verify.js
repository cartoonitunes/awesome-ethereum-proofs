#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.1.3+commit.028f561d.js';
const P=path.join(__dirname,'soljson-v0.1.3+commit.028f561d.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Greeter.sol'),'utf8');
  const raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'G.sol':src}}),1);
  const out=JSON.parse(raw);
  const c=Object.entries(out.contracts).find(([k])=>k.endsWith('Greeter'))[1];
  const rt=(c.runtimeBytecode||c['bin-runtime']||'').toLowerCase();
  const t=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  console.log('exact match:', rt===t);
  process.exit(rt===t?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
