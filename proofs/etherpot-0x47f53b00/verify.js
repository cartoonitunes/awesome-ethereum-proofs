const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Lotto.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.1.js');
const ADDRESS = '0x47f53b00f6d67da01dd67f1d6ea6e9fbe7416adf';

const EXPECTED_RUNTIME_SHA = 'd680a92a9e11813a20b55289b5276095967b7d92eb76930f390365da83ae8b52';
const EXPECTED_CREATION_SHA = '621530c5eb0e131d202d721df50e7f9bb1d4e9951e2bb705cc73fc49dcca4952';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('EtherPot (draft build) Verification');
  console.log(`Contract: ${ADDRESS}`);
  console.log('Compiler: soljson v0.1.1+commit.6ff4cd6 (optimizer OFF)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.1...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0)); // 0 = optimizer OFF

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['Lotto'] || out.contracts[':Lotto'];
  const compiledBin = contract.bytecode;
  const runtimeIdx = compiledBin.indexOf(TARGET_RUNTIME);
  if (runtimeIdx < 0) {
    console.log('FAIL: runtime not found in compiled output');
    process.exit(1);
  }

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledBin, 'hex')).digest('hex');

  console.log(`Init: ${runtimeIdx / 2} bytes`);
  console.log(`Runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Compiled creation: ${compiledBin.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  const onChainOk = compiledBin === TARGET_CREATION; // 0 constructor args, exact equality
  console.log(`Runtime match:     ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation SHA:      ${creationOk ? 'PASS' : 'FAIL'}`);
  console.log(`On-chain creation: ${onChainOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk && onChainOk) {
    console.log();
    console.log('VERIFIED: exact bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH');
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
