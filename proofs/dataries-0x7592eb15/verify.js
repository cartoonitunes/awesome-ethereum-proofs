#!/usr/bin/env node
// Near-exact verification of Dataries (symbol "7") 0x7592eb1596614e420214f4f6259cbc37f09178d4.
// Dataries is a renamed copy of the verified SiaCashCoin airdrop template — it changes only
// the token name/symbol and initial supply; the logic (decimals 18, div(100000).mul(99999),
// toGive>0) is the template default. Compiled with soljson v0.4.25 (optimizer ON, 200 runs),
// the deployed runtime matches on-chain byte-for-byte; only the trailing bzzr0 swarm hash
// differs -> near_exact_match. The public SiaCashCoin() function is the unrenamed-constructor
// copy-paste artifact (selector 0x9a4b19e4). Self-contained: needs only Node.
const fs = require('fs');
const compileStandard = require('./soljson-v0.4.25.js').cwrap('compileStandard', 'string', ['string']);
const input = { language: 'Solidity', sources: { 'Dataries.sol': { content: fs.readFileSync('Dataries.sol', 'utf8') } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { '*': { '*': ['evm.deployedBytecode.object'] } } } };
const out = JSON.parse(compileStandard(JSON.stringify(input)));
const rt = out.contracts['Dataries.sol'].Dataries.evm.deployedBytecode.object.toLowerCase();
const tgt = fs.readFileSync('onchain_runtime.hex', 'utf8').trim().replace(/^0x/, '').toLowerCase();
const strip = s => s.replace(/a165627a7a72305820[0-9a-f]{64}0029$/, '');
console.log('compiled runtime:', rt.length / 2, 'bytes   on-chain:', tgt.length / 2, 'bytes');
console.log('full match:', rt === tgt);
const ok = strip(rt) === strip(tgt);
console.log(ok ? 'NEAR-EXACT MATCH: executable runtime identical; only bzzr0 swarm hash differs' : 'FAIL');
process.exit(ok ? 0 : 1);
