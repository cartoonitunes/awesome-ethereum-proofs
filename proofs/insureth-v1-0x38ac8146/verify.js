const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Insurance.sol'), 'utf8');
const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.1.js');
const ADDRESS = '0x38ac81460ae7ff8b50e1ee6e4beaae8f9722049b';
const DEPLOY_TX = '0x8d963ca3b056e3d1502af0f1701ccd8f22e3a59c3c6e76e2122f3e37432a2a9e';

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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('InsurETH v1 Verification');
  console.log(`Contract: ${ADDRESS}`);
  console.log('Compiler: soljson v0.1.1+commit.6ff4cd6 (optimizer ON)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.1...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1));

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['Insurance'] || out.contracts[':Insurance'];
  const compiledBin = contract.bytecode;
  const runtimeIdx = compiledBin.indexOf(TARGET_RUNTIME);
  if (runtimeIdx < 0) {
    console.log('FAIL: runtime not found in compiled output');
    process.exit(1);
  }

  const runtime = TARGET_RUNTIME;
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(compiledBin, 'hex')).digest('hex');

  console.log(`Init: ${runtimeIdx / 2} bytes`);
  console.log(`Runtime: ${runtime.length / 2} bytes`);
  console.log(`Compiled creation: ${compiledBin.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);
  console.log(`Creation SHA-256: ${creationHash}`);
  console.log();

  const EXPECTED_RUNTIME_SHA = '762d662dabb3493ca4832e0df558cdd60cf46fe4ed54f2aa88674d806d391272';
  const EXPECTED_CREATION_SHA = '61dae5357f55c84e07a4933a303582b66df32d94212d67525475ecec0dccb883';

  const runtimeOk = runtimeHash === EXPECTED_RUNTIME_SHA;
  const creationOk = creationHash === EXPECTED_CREATION_SHA;
  console.log(`Runtime match:  ${runtimeOk ? 'PASS' : 'FAIL'}`);
  console.log(`Creation match: ${creationOk ? 'PASS' : 'FAIL'}`);

  if (runtimeOk && creationOk) {
    console.log();
    console.log('VERIFIED: exact creation bytecode match (init + runtime)');
  } else {
    console.log();
    console.log('MISMATCH against expected SHA-256 hashes');
    process.exit(1);
  }

  const apikey = process.env.ETHERSCAN_API_KEY;
  if (apikey) {
    console.log();
    console.log('Cross-checking against on-chain bytecode...');
    const tx = await fetchJson(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${DEPLOY_TX}&apikey=${apikey}`);
    if (tx.result && tx.result.input) {
      const onChain = tx.result.input.substring(2);
      const onChainSha = crypto.createHash('sha256').update(Buffer.from(onChain, 'hex')).digest('hex');
      console.log(`On-chain SHA-256: ${onChainSha}`);
      console.log(onChain === compiledBin ? 'On-chain match: PASS' : 'On-chain match: FAIL');
    } else {
      console.log('Could not fetch on-chain (etherscan returned no result), skipping');
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
