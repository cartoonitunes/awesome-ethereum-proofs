#!/usr/bin/env node
// Bytecode proof for 0x68322340ff01215643b0615ba1980a10a9db5c57
// (Escrow withdraw/refund cluster, 4,463+ siblings, Nov 2018).
// Compiles Escrow.sol with soljson-v0.4.24+commit.e67f0147 (optimizer ON,
// runs=200) and asserts code-only match against the on-chain runtime.
// Only the trailing 34-byte Swarm/CBOR metadata differs because the exact
// source formatting is not preserved; the 518 code bytes match exactly.
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.4.24+commit.e67f0147.js';
const P=path.join(__dirname,'soljson-v0.4.24+commit.e67f0147.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(hex){return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Escrow.sol'),'utf8');
  const input={language:'Solidity',sources:{'Escrow.sol':{content:src}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}};
  const raw=m.cwrap('compileStandard','string',['string','number'])(JSON.stringify(input),0);
  const out=JSON.parse(raw);
  if(out.errors&&out.errors.some(e=>/error/i.test(typeof e==='string'?e:(e.severity||'')))){console.error(out.errors);process.exit(1);}
  const rt=out.contracts['Escrow.sol']['Escrow'].evm.deployedBytecode.object.toLowerCase();
  const tgt=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const codeOnly=rt.length===tgt.length&&rt.slice(0,-68)===tgt.slice(0,-68);
  const exact=rt===tgt;
  console.log('compiler       : soljson-v0.4.24+commit.e67f0147 (optimizer ON, runs=200)');
  console.log('runtime length : '+tgt.length/2+' bytes');
  console.log('code bytes     : '+tgt.slice(0,-68).length/2+' (excluding 34-byte swarm metadata)');
  console.log('code sha256    : '+sha(tgt.slice(0,-68)));
  console.log('exact match    : '+exact);
  console.log('code-only match: '+codeOnly+'  (swarm hash differs from source formatting)');
  process.exit(codeOnly?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
