const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Logger.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.2+commit.d0d36e3.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.2.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Logger Contract Verification');
  console.log('Contract: 0x7b6556b40a5a4d40118387495314f4445986239c');
  console.log('Compiler: soljson-v0.1.2+commit.d0d36e3');
  console.log('Optimizer: OFF');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0));

  if (out.errors) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  for (const [name, contract] of Object.entries(out.contracts || {})) {
    const bin = contract.bytecode || '';
    const fullCreation = bin;

    // Find runtime in creation bytecode
    const runtimeStart = bin.indexOf(TARGET_RUNTIME);
    if (runtimeStart < 0) {
      console.log(`${name}: runtime not found in creation bytecode`);
      continue;
    }

    const runtime = TARGET_RUNTIME;
    const init = bin.substring(0, runtimeStart);

    console.log(`Contract: ${name}`);
    console.log(`Init: ${init.length / 2} bytes`);
    console.log(`Runtime: ${runtime.length / 2} bytes`);
    console.log();

    const runtimeMatch = bin.includes(TARGET_RUNTIME);
    const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
    const creationHash = crypto.createHash('sha256').update(Buffer.from(fullCreation, 'hex')).digest('hex');

    console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);
    console.log(`Runtime SHA-256: ${runtimeHash}`);
    console.log(`Creation SHA-256: ${creationHash}`);

    if (runtimeMatch) {
      console.log();
      console.log('VERIFIED: exact bytecode match');
    }
  }
}

main().catch(console.error);
