#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.4.11+commit.68ef5810.js';
const P=path.join(__dirname,'soljson-v0.4.11+commit.68ef5810.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(hex){return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Msg.sol'),'utf8');
  let raw;
  try{raw=m.cwrap('compileStandard','string',['string','number'])(JSON.stringify({language:'Solidity',sources:{'Msg.sol':{content:src}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}}),0);}catch(e){}
  if(!raw)raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'Msg.sol':src}}),1);
  const out=JSON.parse(raw);
  let rt='';
  if(out.contracts&&out.contracts['Msg.sol']) rt=(out.contracts['Msg.sol']['Msg'].evm?.deployedBytecode?.object||'').toLowerCase();
  if(!rt) for(const k of Object.keys(out.contracts||{}))if(k.endsWith('Msg')){rt=(out.contracts[k].runtimeBytecode||out.contracts[k]['bin-runtime']||'').toLowerCase();break;}
  const t=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const code=rt.length===t.length&&rt.slice(0,-68)===t.slice(0,-68);
  console.log('compiler: soljson-v0.4.11+commit.68ef5810 (optimizer ON, runs=200)');
  console.log('runtime:', t.length/2, 'B sha256:', sha(t.slice(0,-68)));
  console.log('code-only match:', code);
  process.exit(code?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
