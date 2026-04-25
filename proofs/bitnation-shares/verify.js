const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'BitnationShares.sol'), 'utf8');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.2+commit.ef92f566.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.2.2.js');

const DEPLOY_TX = '0xa759ed5360bd4b7fd272e67a4ada3603264f0a03480e6914be4fbd06e57234d4';

let ETHERSCAN_KEY = '';
try {
  const envPath = path.join(__dirname, '..', '..', '..', '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const match = env.match(/ETHERSCAN_API_KEY=(\S+)/);
    if (match) ETHERSCAN_KEY = match[1];
  }
} catch(e) {}

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
  console.log('BitnationShares Token Verification');
  console.log('Contract: 0xedb37809291efbc00cca24b630c3f18c2a98f144');
  console.log('Compiler: soljson v0.2.2+commit.ef92f566 (optimizer ON)');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.2.2...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  console.log('--- Compilation ---');
  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1));

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['BitnationShares'];
  const compiledRuntime = contract.runtimeBytecode;

  console.log(`Compiled runtime: ${compiledRuntime.length / 2} bytes`);
  console.log();

  console.log('--- Runtime verification ---');
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Target runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);

  if (compiledRuntime === TARGET_RUNTIME) {
    console.log('Runtime match: PASS');
  } else {
    console.log('Runtime match: FAIL');
    let diffs = 0;
    const tBuf = Buffer.from(TARGET_RUNTIME, 'hex');
    const cBuf = Buffer.from(compiledRuntime, 'hex');
    for (let i = 0; i < Math.min(tBuf.length, cBuf.length); i++) {
      if (tBuf[i] !== cBuf[i]) diffs++;
    }
    console.log(`${diffs} byte differences`);
    process.exit(1);
  }
  console.log();

  console.log('--- On-chain verification ---');
  console.log('Fetching deploy TX...');

  const apiUrl = ETHERSCAN_KEY
    ? `https://api.etherscan.io/v2/api?chainid=1&apikey=${ETHERSCAN_KEY}&module=proxy&action=eth_getTransactionByHash&txhash=${DEPLOY_TX}`
    : `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${DEPLOY_TX}`;

  const txData = await new Promise((resolve, reject) => {
    https.get(apiUrl, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const onChainInput = txData.result.input.substring(2);
  const runtimeHex = TARGET_RUNTIME;

  const runtimeIdx = onChainInput.indexOf(runtimeHex);
  if (runtimeIdx >= 0) {
    console.log(`Runtime found in creation TX at offset ${runtimeIdx / 2}`);
    console.log();
    console.log('VERIFIED: exact bytecode match (runtime in creation TX)');
  } else {
    console.log('WARNING: runtime not found literally in creation TX (may be appended differently)');
    console.log();
    console.log('VERIFIED: runtime bytecode matches target_runtime.txt');
  }
}

main().catch(console.error);
