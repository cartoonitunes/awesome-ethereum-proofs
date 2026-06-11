const fs=require('fs'),path=require('path'),crypto=require('crypto'),https=require('https');
const TARGET=fs.readFileSync(path.join(__dirname,'target_runtime.txt'),'utf8').trim();
const SRC=fs.readFileSync(path.join(__dirname,'Token.sol'),'utf8');
const URL='https://binaries.soliditylang.org/bin/soljson-v0.2.0+commit.4dc2445e.js';
const FILE=path.join(__dirname,'soljson-v0.2.0.js');
function dl(u,d){return new Promise((res,rej)=>{const f=fs.createWriteStream(d);https.get(u,r=>{
 if(r.statusCode===301||r.statusCode===302){f.close();fs.unlinkSync(d);return dl(r.headers.location,d).then(res).catch(rej);}
 r.pipe(f);f.on('finish',()=>{f.close();res();});}).on('error',rej);});}
async function main(){
 if(!fs.existsSync(FILE)){console.log('Downloading compiler...');await dl(URL,FILE);}
 const solc=require(FILE);const out=JSON.parse(solc.cwrap('compileJSON','string',['string','number'])(SRC,1));
 if(out.errors){console.log('ERRORS',out.errors);process.exit(1);}
 const bin=out.contracts['Token'].bytecode.toLowerCase();const ok=bin.includes(TARGET);
 console.log('Runtime '+TARGET.length/2+'B SHA-256 '+crypto.createHash('sha256').update(Buffer.from(TARGET,'hex')).digest('hex'));
 console.log('Runtime match: '+(ok?'PASS':'FAIL'));process.exit(ok?0:1);
}
main().catch(console.error);
