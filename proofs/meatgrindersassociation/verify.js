const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();
const TARGET_CREATION = fs.readFileSync(path.join(__dirname, 'target_creation.txt'), 'utf8').trim();
const SOURCE = fs.readFileSync(path.join(__dirname, 'MeatGrindersAssociation.sol'), 'utf8');
const COMPILER_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.2.1+commit.91a6b35f.js';
const COMPILER_FILE = path.join(__dirname, 'soljson-v0.2.1.js');

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
  console.log('MeatGrindersAssociation Contract Verification');
  console.log('Contract: 0xc7e9dDd5358e08417b1C88ed6f1a73149BEeaa32');
  console.log('Compiler: soljson-v0.2.1+commit.91a6b35f (optimizer ON)');
  console.log();

  if (!fs.existsSync(COMPILER_FILE)) {
    console.log('Downloading compiler...');
    await download(COMPILER_URL, COMPILER_FILE);
  }

  const solc = require(COMPILER_FILE);
  const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
  const out = JSON.parse(compile(SOURCE, 1)); // optimizer ON

  if (out.errors && out.errors.some(e => /Error/i.test(e))) {
    console.log('COMPILE ERRORS:', out.errors);
    process.exit(1);
  }

  const contract = out.contracts['MeatGrindersAssociation'];
  const creation = contract.bytecode.toLowerCase();
  const runtime = contract.runtimeBytecode.toLowerCase();
  const target_runtime = TARGET_RUNTIME.toLowerCase().replace(/^0x/, '');
  const target_creation = TARGET_CREATION.toLowerCase().replace(/^0x/, '');

  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(runtime, 'hex')).digest('hex');
  const creationHash = crypto.createHash('sha256').update(Buffer.from(creation, 'hex')).digest('hex');

  console.log(`Creation (compiled):  ${creation.length / 2} bytes`);
  console.log(`Creation (on-chain):  ${target_creation.length / 2} bytes (compiled + 192 byte constructor args)`);
  console.log(`Runtime:              ${runtime.length / 2} bytes`);
  console.log(`Runtime SHA-256:      ${runtimeHash}`);
  console.log(`Creation SHA-256:     ${creationHash}`);
  console.log();

  const runtimeMatch = runtime === target_runtime;
  const creationPrefix = target_creation.slice(0, creation.length);
  const creationMatch = creationPrefix === creation;
  const constructorArgs = target_creation.slice(creation.length);

  console.log(`Runtime match:        ${runtimeMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Creation prefix match: ${creationMatch ? 'PASS' : 'FAIL'}`);

  if (runtimeMatch && creationMatch) {
    console.log();
    console.log('Constructor args (' + constructorArgs.length / 2 + ' bytes):');
    for (let i = 0; i < constructorArgs.length; i += 64) {
      console.log('  0x' + constructorArgs.slice(i, i + 64));
    }
    console.log();
    console.log('  unicornAddress             = 0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7');
    console.log('  meatAddress                = 0xed6ac8de7c7ca7e3a22952e09c2a2a1232ddef9a');
    console.log('  minimumUnicornsToPassAVote = 1');
    console.log('  minutesForDebate           = 0');
    console.log('  multiplierForVotesAgainst  = 4');
    console.log('  meatCalculator             = 0x4ab274fc3a81b300a0016b3805d9b94c81fa54d2');
    console.log();
    console.log('VERIFIED: exact bytecode match (runtime + creation prefix)');
  } else {
    process.exit(1);
  }
}

main().catch(console.error);
