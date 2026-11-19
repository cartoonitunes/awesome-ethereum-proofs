#!/usr/bin/env node
// Byte-for-byte proof for 0xd8681c956d3a4c50fa491c4ede2bd9e0b8d29db0
// (Homestead-era ETH-forwarding cluster, 805+ siblings, March 2016).
// Compiles Forwarder.sol with soljson-v0.1.6+commit.d41f8b7c (optimizer ON)
// and asserts exact byte-for-byte match against the on-chain runtime.
'use strict';
const fs=require('fs'),path=require('path'),https=require('https'),crypto=require('crypto');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const P=path.join(__dirname,'soljson-v0.1.6+commit.d41f8b7c.js');
function dl(u,d){return new Promise((res,rej)=>{if(fs.existsSync(d))return res();const f=fs.createWriteStream(d);https.get(u,r=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));r.pipe(f);f.on('finish',()=>f.close(res));}).on('error',rej);});}
function sha(hex){return crypto.createHash('sha256').update(Buffer.from(hex,'hex')).digest('hex');}
(async()=>{
  await dl(URL,P);
  const m=require(P);
  const src=fs.readFileSync(path.join(__dirname,'Forwarder.sol'),'utf8');
  const raw=m.cwrap('compileJSONMulti','string',['string','number'])(JSON.stringify({sources:{'Forwarder.sol':src}}),1);
  const out=JSON.parse(raw);
  const c=out.contracts['Forwarder.sol:Forwarder']||out.contracts[':Forwarder']||Object.entries(out.contracts).find(([k])=>k.endsWith('Forwarder'))[1];
  const rt=(c.runtimeBytecode||c['bin-runtime']||'').toLowerCase();
  const tgt=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim().replace(/^0x/,'').toLowerCase();
  const exact=rt===tgt;
  console.log('compiler       : soljson-v0.1.6+commit.d41f8b7c (optimizer ON)');
  console.log('runtime length : '+tgt.length/2+' bytes');
  console.log('sha256         : '+sha(tgt));
  console.log('EXACT match    : '+exact);
  process.exit(exact?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
