const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE_URL = 'https://raw.githubusercontent.com/pipermerriam/ethereum-public-trust/27ed96917651aa75d6a795851d06249c31833c11/contracts/main.sol';
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.1.1.js');

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

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log('MembershipRoster Contract Verification');
  console.log('Contract: 0xf1d3271d6d10826af877d99233869d7238aa0455');
  console.log('Compiler: soljson-v0.1.1+commit.6ff4cd6 (optimizer OFF)');
  console.log();

  console.log(`Source: ${SOURCE_URL}`);
  console.log();

  console.log('Fetching source from GitHub...');
  const SOURCE = await fetch(SOURCE_URL);

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

  const compiled = out.contracts['MembershipRoster'].bytecode;

  const creationHash = crypto.createHash('sha256').update(Buffer.from(TARGET, 'hex')).digest('hex');
  const compiledHash = crypto.createHash('sha256').update(Buffer.from(compiled, 'hex')).digest('hex');

  console.log(`Creation bytecode: ${TARGET.length / 2} bytes`);
  console.log(`Creation SHA-256:  ${creationHash}`);
  console.log(`Compiled SHA-256:  ${compiledHash}`);
  console.log();

  const match = compiled === TARGET;
  console.log(`Bytecode match: ${match ? 'PASS' : 'FAIL'}`);

  if (match) {
    console.log();
    console.log('VERIFIED: compiled output is byte-for-byte identical to on-chain creation bytecode');
  }
}

main().catch(console.error);
