const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'EtherVote.sol'), 'utf8');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.4.11+commit.68ef5810.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.4.11.js');

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
  console.log('EtherVote Verification');
  console.log('Contract: 0x8a57d2708d1f228dac2f7934f5311cd2a0a1cda4');
  console.log('Compiler: soljson v0.4.11+commit.68ef5810 (optimizer OFF)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.4.11...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  console.log('--- Compilation ---');
  const soljson = require(SOLJSON_FILE);
  const compile = soljson.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0)); // optimizer OFF

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts[':EtherVote'];
  const compiledRuntime = contract.runtimeBytecode;

  console.log(`Compiled runtime: ${compiledRuntime.length / 2} bytes`);
  console.log();

  console.log('--- Runtime verification ---');
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Target runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log();

  // For post-0.4.7 contracts, compare code section without CBOR (last 43 bytes)
  const CBOR_SIZE = 43;
  const targetCode = TARGET_RUNTIME.slice(0, -CBOR_SIZE * 2);
  const compiledCode = compiledRuntime.slice(0, -CBOR_SIZE * 2);

  if (compiledCode === targetCode) {
    console.log('Code match (excluding CBOR metadata): PASS');
    if (compiledRuntime === TARGET_RUNTIME) {
      console.log('Exact match: PASS (CBOR also matches)');
    } else {
      console.log('Exact match: PARTIAL (CBOR metadata hash differs — expected for source recovered separately)');
      console.log(`Target CBOR:   ${TARGET_RUNTIME.slice(-CBOR_SIZE * 2)}`);
      console.log(`Compiled CBOR: ${compiledRuntime.slice(-CBOR_SIZE * 2)}`);
    }
  } else {
    console.log('Code match: FAIL');
    process.exit(1);
  }
}

main().catch(console.error);
