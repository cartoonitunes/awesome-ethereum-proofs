#!/usr/bin/env node
// Bytecode proof for 0x850c3beae3766e3efcf76ade7cbd6e3e0aec517e
// (Wallet with ERC-223 tokenFallback cluster, 1,374+ siblings).
// Compiles Wallet.sol with soljson-v0.4.15+commit.bbb8e64f (optimizer ON,
// runs=200) and asserts code-only match against the on-chain runtime.
// Only the trailing 34-byte Swarm/CBOR metadata differs (source formatting delta).
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.4.15+commit.bbb8e64f.js';
const P=path.join(__dirname,'soljson-v0.4.15+commit.bbb8e64f.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(hex){return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Wallet.sol'),'utf8');
  const raw=m.cwrap('compileStandard','string',['string','number'])(JSON.stringify({language:'Solidity',sources:{'Wallet.sol':{content:src}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}}),0);
  const out=JSON.parse(raw);
  if(out.errors&&out.errors.some(e=>/error/i.test(typeof e==='string'?e:(e.severity||'')))){console.error(out.errors);process.exit(1);}
  const rt=out.contracts['Wallet.sol']['Wallet'].evm.deployedBytecode.object.toLowerCase();
  const tgt=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const codeOnly=rt.length===tgt.length&&rt.slice(0,-68)===tgt.slice(0,-68);
  console.log('compiler       : soljson-v0.4.15+commit.bbb8e64f (optimizer ON, runs=200)');
  console.log('runtime length : '+tgt.length/2+' bytes');
  console.log('code bytes     : '+tgt.slice(0,-68).length/2);
  console.log('code sha256    : '+sha(tgt.slice(0,-68)));
  console.log('code-only match: '+codeOnly);
  process.exit(codeOnly?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
