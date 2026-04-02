const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Store.sol'), 'utf8');

const EXPECTED_CREATION = '6060604052606b8060106000396000f3' + TARGET_RUNTIME;

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.6+commit.d41f8b7c.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.6.js');

const DEPLOY_TX = '0x1c06a614b8f71b4bfe899ed14d0d90d511055473f94f3d621bcab681b3a3bf82';
const CONTRACT_ADDR = '0x62149267d120ac6f6a6f7bb317f9d77a5c3512fc';

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
  console.log('Store Contract Verification');
  console.log('Contract: ' + CONTRACT_ADDR);
  console.log('Compiler: soljson v0.1.6 (optimizer ON)');
  console.log('');

  // Step 1: Compile and verify
  console.log('--- Compilation verification ---');

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

  const contract = out.contracts[':Store'] || out.contracts['Store'];
  const bin = contract.bytecode;

  console.log('Compiled: ' + (bin.length / 2) + ' bytes');
  console.log('');

  // Step 2: Compare creation bytecode
  console.log('--- Creation bytecode comparison ---');

  if (bin === EXPECTED_CREATION) {
    console.log('Creation match: PASS');
  } else {
    console.log('Creation match: FAIL');
    console.log('Expected: ' + EXPECTED_CREATION.substring(0, 80) + '...');
    console.log('Got:      ' + bin.substring(0, 80) + '...');
    process.exit(1);
  }

  // Step 3: Verify runtime portion
  const runtimeIdx = bin.indexOf(TARGET_RUNTIME);
  if (runtimeIdx >= 0) {
    console.log('Runtime match: PASS');
  } else {
    console.log('Runtime match: FAIL');
    process.exit(1);
  }

  // Step 4: SHA-256 hashes
  console.log('');
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(EXPECTED_CREATION, 'hex')).digest('hex');
  console.log('Runtime:  ' + (TARGET_RUNTIME.length / 2) + ' bytes  SHA-256: ' + runtimeHash);
  console.log('Creation: ' + (EXPECTED_CREATION.length / 2) + ' bytes  SHA-256: ' + creationHash);

  // Step 5: Fetch on-chain and compare
  console.log('');
  console.log('--- On-chain comparison ---');
  console.log('Fetching deploy TX ' + DEPLOY_TX.substring(0, 16) + '...');

  const txData = await new Promise((resolve, reject) => {
    const apiKey = process.env.ETHERSCAN_API_KEY || '';
    const url = 'https://api.etherscan.io/v2/api?chainid=1&apikey=' + apiKey + '&module=proxy&action=eth_getTransactionByHash&txhash=' + DEPLOY_TX;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) {
          // v2 API may redirect
          if (res.statusCode === 301 || res.statusCode === 302) {
            const redirect = res.headers.location;
            https.get(redirect, res2 => {
              let d2 = '';
              res2.on('data', chunk => d2 += chunk);
              res2.on('end', () => resolve(JSON.parse(d2)));
            }).on('error', reject);
          } else { reject(e); }
        }
      });
    }).on('error', reject);
  });

  if (!txData.result || typeof txData.result !== 'object') {
    console.log('Could not fetch on-chain TX (API key may be needed)');
    console.log('Local verification PASSED. Run with ETHERSCAN_API_KEY env var for on-chain check.');
    return;
  }

  const onChainCreation = txData.result.input.substring(2); // remove 0x

  console.log('On-chain: ' + (onChainCreation.length / 2) + ' bytes');

  if (onChainCreation === EXPECTED_CREATION) {
    console.log('');
    console.log('VERIFIED: exact creation bytecode match (init + runtime)');
    console.log('Note: contract was selfdestructed, runtime no longer on-chain');
  } else {
    console.log('');
    console.log('MISMATCH');
    let diffs = 0;
    for (let i = 0; i < Math.min(onChainCreation.length, EXPECTED_CREATION.length); i += 2) {
      if (onChainCreation.substring(i, i + 2) !== EXPECTED_CREATION.substring(i, i + 2)) diffs++;
    }
    console.log(diffs + ' byte differences');
    process.exit(1);
  }
}

main().catch(console.error);
