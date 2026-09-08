#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.4.17+commit.bdeb9e52.js';
const P=path.join(__dirname,'soljson-v0.4.17+commit.bdeb9e52.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(hex){return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Forwarder.sol'),'utf8');
  const raw=m.cwrap('compileStandard','string',['string','number'])(JSON.stringify({language:'Solidity',sources:{'Forwarder.sol':{content:src}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}}),0);
  const rt=JSON.parse(raw).contracts['Forwarder.sol']['Forwarder'].evm.deployedBytecode.object.toLowerCase();
  const t=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const code=rt.length===t.length&&rt.slice(0,-68)===t.slice(0,-68);
  console.log('compiler: soljson-v0.4.17+commit.bdeb9e52 (opt ON, runs=200)');
  console.log('sizes:', rt.length/2, 'vs', t.length/2, 'sha256:', sha(t.slice(0,-68)));
  console.log('code-only match:', code);
  process.exit(code?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
