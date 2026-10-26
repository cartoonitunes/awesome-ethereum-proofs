// self-contained old-soljson compiler: node compile_ih.js <soljson.js> <src.sol> <optimize>
const fs=require('fs');
const path=process.argv[2];
global.Module=undefined;
const soljson=require(path);
let compileJSON;
try { compileJSON = soljson.cwrap('compileJSON','string',['string','number']); }
catch(e){ try{ compileJSON = soljson.cwrap('compileJSON','string',['string','number']); }catch(e2){} }
if(!compileJSON && soljson.Module){ compileJSON = soljson.Module.cwrap('compileJSON','string',['string','number']); }
const src=fs.readFileSync(process.argv[3],'utf8');
const opt=parseInt(process.argv[4]||'1');
let out;
try{ out=compileJSON(src,opt); }catch(e){ console.error('THROW',e.message); process.exit(2); }
let r; try{ r=JSON.parse(out);}catch(e){ console.error('BADJSON',out.slice(0,200)); process.exit(3);}
if(r.errors){ const e=r.errors.filter(x=>!/warning/i.test(x)); if(e.length){ console.error('ERR '+e.join(' | ').slice(0,300)); } }
if(!r.contracts){ console.error('NOCONTRACTS'); process.exit(4); }
for(const n of Object.keys(r.contracts)){
  const c=r.contracts[n];
  console.log(n.replace(/^:/,'')+' '+((c.runtimeBytecode||'').length/2)+' '+(c.runtimeBytecode||''));
}
