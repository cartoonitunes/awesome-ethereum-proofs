const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Invoice.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.1+commit.91a6b35f.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.2.1.js');
const ADDRESS = '0xb16acc642740372ed53af51ff7e82f1dbc5cee2d';

const EXPECTED_RUNTIME_SHA = 'c104635c9f0cb8e0135a376402b77887795c0eee2e3c3fbfa856ace2573e9729';
const EXPECTED_CREATION_SHA = '5d03dbd3b5165d7c316cc5389af2e935c9948d40fb7fac3aca098c603b3a6e16';
const EXACT_CREATION = true; // false when the contract has constructor args

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Invoice verification (0xb16acc642740372ed53af51ff7e82f1dbc5cee2d)');
  console.log('Compiler: soljson-v0.2.1+commit.91a6b35f (optimizer OFF)');
  if (!fs.existsSync(SOLJSON_FILE)) { console.log('Downloading compiler...'); await download(SOLJSON_URL, SOLJSON_FILE); }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));
  if (out.errors && !out.contracts) { console.log('COMPILE ERRORS:', out.errors); process.exit(1); }

  const contract = out.contracts['Invoice'] || out.contracts[':Invoice'];
  const compiledBin = contract.bytecode;
  if (compiledBin.indexOf(TARGET_RUNTIME) < 0) { console.log('FAIL: runtime not in compiled output'); process.exit(1); }

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledBin, 'hex')).digest('hex');

  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  const onChainOk = EXACT_CREATION ? (compiledBin === TARGET_CREATION) : TARGET_CREATION.startsWith(compiledBin);
  console.log(`Runtime match:     ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation SHA:      ${creationOk ? 'PASS' : 'FAIL'}`);
  console.log(`On-chain creation: ${onChainOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk && onChainOk) console.log('VERIFIED: exact bytecode match (init + runtime)');
  else { console.log('MISMATCH'); process.exit(1); }
}

main().catch(err => { console.error(err); process.exit(1); });
