#!/usr/bin/env node
// Near-exact verification of the Curio Cards 886-byte vending machines.
// Compiles CurioCardVendingMachine.sol with the bundled soljson v0.4.11 (optimizer
// OFF) and checks the runtime against each card's on-chain code. All executable
// bytecode matches byte-for-byte; only the trailing bzzr0 metadata/swarm hash differs
// (original source-file text not recovered). ABI/function names recovered from
// curiocards.github.io/js/vending.js. Self-contained: needs only Node + the bundled .js.
const fs=require('fs');
const M=require('./soljson-v0.4.11.js');
const compileJSON=M.cwrap('compileJSON','string',['string','number']);
const out=JSON.parse(compileJSON(fs.readFileSync('CurioCardVendingMachine.sol','utf8'),0));
const key=Object.keys(out.contracts).find(x=>x.includes('Vending'));
const rt=(out.contracts[key].runtimeBytecode||out.contracts[key]['bin-runtime']).toLowerCase();
const strip=s=>s.replace(/a165627a7a7230582[0-9a-f]{65}0029$/,'');
const cards={10:'card10_0x46c47231.hex',11:'card11_0xb45e6719.hex',13:'card13_0x3cf5c70a.hex',14:'card14_0xa27c29ce.hex'};
let allok=true;
for(const [n,f] of Object.entries(cards)){
  const tgt=fs.readFileSync(f,'utf8').trim().toLowerCase();
  const codeExact=strip(rt)===strip(tgt), full=rt===tgt;
  console.log(`Card #${n}: ${tgt.length/2}B  code-exact=${codeExact}  full-exact=${full}`);
  allok=allok&&codeExact;
}
console.log(allok?'NEAR-EXACT MATCH: all executable code identical across the family; only bzzr0 swarm hash differs':'FAIL');
process.exit(allok?0:1);
