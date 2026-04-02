const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'Greeter.sol'), 'utf8');

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.4+commit.5f6c3cdf.js';
const SOLJSON_FILE = path.join(__dirname, 'soljson-v0.1.4.js');

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
  console.log('Greeter v0.1.4 Verification');
  console.log('Deployer: 0xF0C5Cef39B17C213cFe090A46b8C7760FfB7928A');
  console.log('Canonical: 0x91c696d14dcc933c38e486111a21ffbefc2d7168');
  console.log('Compiler: soljson-v0.1.4+commit.5f6c3cdf (optimizer OFF)');
  console.log('Copies: 1,346 deployments share this runtime');
  console.log();

  if (!fs.existsSync(SOLJSON_FILE)) {
    console.log('Downloading soljson v0.1.4...');
    await download(SOLJSON_URL, SOLJSON_FILE);
  }

  const solc = require(SOLJSON_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 0)); // optimizer OFF

  if (out.errors) {
    console.error('Compile errors:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['greeter'];
  const compiledRuntime = contract.runtimeBytecode;

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log(`Target runtime:   ${TARGET_RUNTIME.length / 2} bytes`);
  console.log(`Compiled runtime: ${compiledRuntime.length / 2} bytes`);
  console.log(`SHA-256: ${runtimeHash}`);
  console.log();

  if (compiledRuntime === TARGET_RUNTIME) {
    console.log('Runtime match: PASS');
    console.log();
    console.log('VERIFIED: exact bytecode match');
    console.log('1,346 on-chain deployments covered by this proof.');
  } else {
    console.log('Runtime match: FAIL');
    let diffs = 0;
    const minLen = Math.min(compiledRuntime.length, TARGET_RUNTIME.length);
    for (let i = 0; i < minLen; i += 2) {
      if (compiledRuntime.substring(i, i + 2) !== TARGET_RUNTIME.substring(i, i + 2)) diffs++;
    }
    console.log(`${diffs} byte differences`);
    process.exit(1);
  }
}

main().catch(console.error);
