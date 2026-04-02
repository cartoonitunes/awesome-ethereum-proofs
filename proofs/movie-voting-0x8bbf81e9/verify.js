const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'MovieVoting.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.1.js');

// Full creation bytecode (init + runtime, no constructor args)
const EXPECTED_CREATION = '6060604052610111806100136000396000f300' + TARGET_RUNTIME;

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
  console.log('Movie Voting Contract Verification');
  console.log('Contract: 0x8bbf81e9a8e936242354047c9905d621e269c7f7');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // optimizer ON

  if (out.errors) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['MovieVoting'];
  const bin = contract.bytecode;

  // Split at f300 (v0.1.1 init terminator)
  const idx = bin.indexOf('f300');
  const init = bin.substring(0, idx + 4);
  const runtime = bin.substring(idx + 4);

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(bin, 'hex')).digest('hex');

  console.log(`Init: ${init.length / 2} bytes`);
  console.log(`Runtime: ${runtime.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const runtimeMatch = runtime === TARGET_RUNTIME;
  const creationMatch = bin === EXPECTED_CREATION;

  console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Creation match: ${creationMatch ? 'PASS' : 'FAIL'}`);

  if (runtimeMatch && creationMatch) {
    console.log();
    console.log('VERIFIED: exact bytecode match (init + runtime)');
  }
}

main().catch(console.error);
