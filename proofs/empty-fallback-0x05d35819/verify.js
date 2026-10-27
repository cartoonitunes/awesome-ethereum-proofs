#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.4.24+commit.e67f0147.js';
const P=path.join(__dirname,'soljson-v0.4.24+commit.e67f0147.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Empty.sol'),'utf8');
  const raw=m.cwrap('compileStandard','string',['string','number'])(JSON.stringify({language:'Solidity',sources:{'Empty.sol':{content:src}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}}),0);
  const rt=JSON.parse(raw).contracts['Empty.sol']['Empty'].evm.deployedBytecode.object.toLowerCase();
  const t=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const code=rt.length===t.length&&rt.slice(0,-68)===t.slice(0,-68);
  console.log('code-only match:', code);
  process.exit(code?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
