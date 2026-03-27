const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Coin.sol'), 'utf8');

// The native C++ solc produces this exact creation bytecode (init + runtime, before constructor args).
// To independently verify, build webthree-umbrella tag 1.0.1 and compile with --optimize --bin.
const EXPECTED_CREATION = '606060405260405160208061013a8339506080604052518060001415602357506103e85b600160a060020a03331660009081526020819052604090208190555060ee8061004c6000396000f3' + TARGET_RUNTIME;

// soljson v0.1.6 matches the RUNTIME (but not init). Use it for runtime verification without Docker.
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.6.js');

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
  console.log('Coin Tutorial Contract Verification');
  console.log('Contract: 0x283f1161c2d4ff33fd5d5d4486fc0675732cea11');
  console.log('Compiler: native C++ solc v0.1.6 (optimizer ON)');
  console.log();

  // Step 1: Verify runtime via soljson (no Docker needed)
  console.log('--- Runtime verification (soljson) ---');

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.6...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // optimizer ON

  if (out.errors) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts[':Coin'] || out.contracts['Coin'];
  const bin = contract.bytecode;

  // Find runtime in compiled output
  const runtimeIdx = bin.indexOf(TARGET_RUNTIME);
  if (runtimeIdx < 0) {
    console.log('FAIL: runtime not found in soljson output');
    process.exit(1);
  }

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Runtime match (soljson): PASS`);
  console.log();

  // Step 2: Verify full creation bytecode against expected native output
  console.log('--- Full creation verification (native C++ solc) ---');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(EXPECTED_CREATION, 'hex')).digest('hex');
  console.log(`Creation: ${EXPECTED_CREATION.length / 2} bytes`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  // Step 3: Fetch on-chain and compare
  console.log('--- On-chain comparison ---');
  console.log('Fetching on-chain creation bytecode...');

  const txData = await new Promise((resolve, reject) => {
    https.get('https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=0x630beec9848e514d5e1606b9f38abd56464ea5a092c89dfce50d45b1ed4c4dee', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const onChainInput = txData.result.input.substring(2); // remove 0x
  const onChainCreation = onChainInput.substring(0, onChainInput.length - 64); // remove 32B constructor args
  const constructorArgs = onChainInput.substring(onChainInput.length - 64);

  console.log(`On-chain creation: ${onChainCreation.length / 2} bytes`);
  console.log(`Constructor args: 0x${constructorArgs} (supply = ${parseInt(constructorArgs, 16)})`);

  if (onChainCreation === EXPECTED_CREATION) {
    console.log();
    console.log('VERIFIED: exact creation bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH: creation bytecode does not match');
    let diffs = 0;
    for (let i = 0; i < Math.min(onChainCreation.length, EXPECTED_CREATION.length); i += 2) {
      if (onChainCreation.substring(i, i + 2) !== EXPECTED_CREATION.substring(i, i + 2)) diffs++;
    }
    console.log(`${diffs} byte differences`);
    process.exit(1);
  }
}

main().catch(console.error);
