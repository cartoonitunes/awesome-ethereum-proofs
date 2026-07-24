// check_size.js <size> <solc-version> <optimizer>
const fs=require('fs');
const sz=+process.argv[2], v=process.argv[3], opt=+process.argv[4];
const strip=s=>s.replace(/a165627a7a7230582[0-9a-f]{65}0029$/,'');
const M=require('./soljson-'+v+'.js');
const cj=M.cwrap('compileJSON','string',['string','number']);
const o=JSON.parse(cj(fs.readFileSync('CurioCardVendingMachine.sol','utf8'),opt));
const k=Object.keys(o.contracts).find(x=>x.includes('Vending'));
const rt=strip((o.contracts[k].runtimeBytecode||o.contracts[k]['bin-runtime']).toLowerCase());
let n=0, ok=true;
for(const f of fs.readdirSync('.')){
  if(!f.endsWith('.hex'))continue;
  const raw=fs.readFileSync(f,'utf8').trim().replace(/^0x/,'').toLowerCase();
  if(raw.length/2!==sz)continue;
  const m=strip(raw)===rt; ok=ok&&m; n++;
  console.log('  '+f+': code-exact='+m);
}
console.log(sz+'B (solc '+v+' opt='+opt+'): '+n+' cards, '+(ok?'ALL MATCH':'FAIL'));
process.exit(ok&&n>0?0:1);
