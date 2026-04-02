const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'MyToken.sol'), 'utf8');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.3.1+commit.c492d9be.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.3.1.js');

const DEPLOY_TX = '0x3a6e8830855e7c656f96754e66fb2fa10bdf6e306c60478568b94ceeb885ca96';
const CONSTRUCTOR_ARGS_SIZE = 192; // bytes

// Optional: load API key from .env if present
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
  console.log('Meme Token Verification');
  console.log('Contract: 0x84965cf265d75478abd7c6aa45e1b80b5d5e38cf');
  console.log('Compiler: soljson v0.3.1+commit.c492d9be (optimizer ON)');
  console.log();

  // Step 1: Download compiler if needed
  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.3.1...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  // Step 2: Compile
  console.log('--- Compilation ---');
  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // optimizer ON

  if (out.errors && !out.contracts) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const key = Object.keys(out.contracts).find(k => k.endsWith('MyToken') || k === 'MyToken');
  const contract = out.contracts[key];
  const compiledRuntime = contract.runtimeBytecode;
  const compiledCreation = contract.bytecode;

  console.log(`Compiled runtime: ${compiledRuntime.length / 2} bytes`);
  console.log(`Compiled creation (init): ${compiledCreation.length / 2} bytes`);
  console.log();

  // Step 3: Verify runtime match
  console.log('--- Runtime verification ---');
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Target runtime: ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Runtime SHA-256: ${runtimeHash}`);

  if (compiledRuntime === TARGET_RUNTIME) {
    console.log('Runtime match: PASS');
  } else {
    console.log('Runtime match: FAIL');
    process.exit(1);
  }
  console.log();

  // Step 4: Fetch on-chain creation bytecode and verify
  console.log('--- Full creation verification ---');
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

  const onChainInput = txData.result.input.substring(2); // remove 0x
  const onChainInit = onChainInput.substring(0, onChainInput.length - CONSTRUCTOR_ARGS_SIZE * 2);
  const onChainArgs = onChainInput.substring(onChainInput.length - CONSTRUCTOR_ARGS_SIZE * 2);

  console.log(`On-chain creation: ${onChainInput.length / 2} bytes (init ${onChainInit.length / 2} + args ${onChainArgs.length / 2})`);

  const creationHash = crypto.createHash('sha256').update(Buffer.from(onChainInput, 'hex')).digest('hex');
  console.log(`Creation SHA-256: ${creationHash}`);

  // Compare compiled init with on-chain init
  if (compiledCreation === onChainInit) {
    console.log();
    console.log('VERIFIED: exact bytecode match (init + runtime)');
    console.log();
    console.log('Constructor args: initialSupply=256, tokenName="Meme", decimalUnits=0, centralMinter=0x0');
  } else {
    console.log();
    console.log('MISMATCH: init bytecode does not match');
    console.log(`Compiled: ${compiledCreation.length / 2} bytes, On-chain: ${onChainInit.length / 2} bytes`);
    let diffs = 0;
    for (let i = 0; i < Math.min(compiledCreation.length, onChainInit.length); i += 2) {
      if (compiledCreation.substring(i, i + 2) !== onChainInit.substring(i, i + 2)) diffs++;
    }
    console.log(`${diffs} byte differences`);
    process.exit(1);
  }
}

main().catch(console.error);
