#!/usr/bin/env node
// Near-exact verification of EsseChain (ESSECHAIN / ESSE) 0x4c65f9d41d367cb8f6d4810588d50fb397f6f6f4.
// EsseChain is a renamed copy of the verified SiaCashCoin (0x74FD51a9...) airdrop token
// template. Compiled with soljson v0.4.25 (optimizer ON, 200 runs), the deployed runtime
// bytecode matches on-chain byte-for-byte; only the trailing bzzr0 swarm metadata hash
// differs (the original's exact source text wasn't recovered) -> near_exact_match.
// The public SiaCashCoin() function is the copy-paste artifact: the old-style constructor
// was left unrenamed when the contract was renamed to ESSECHAIN, so it became callable.
// Self-contained: needs only Node + the bundled soljson-v0.4.25.js.
const fs = require('fs');
const compileStandard = require('./soljson-v0.4.25.js').cwrap('compileStandard', 'string', ['string']);
const input = {
  language: 'Solidity',
  sources: { 'ESSECHAIN.sol': { content: fs.readFileSync('ESSECHAIN.sol', 'utf8') } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { '*': { '*': ['evm.deployedBytecode.object'] } } },
};
const out = JSON.parse(compileStandard(JSON.stringify(input)));
const rt = out.contracts['ESSECHAIN.sol'].ESSECHAIN.evm.deployedBytecode.object.toLowerCase();
const tgt = fs.readFileSync('onchain_runtime.hex', 'utf8').trim().toLowerCase();
const strip = s => s.replace(/a165627a7a72305820[0-9a-f]{64}0029$/, '');
console.log('compiled runtime:', rt.length / 2, 'bytes   on-chain:', tgt.length / 2, 'bytes');
console.log('full match:', rt === tgt);
const ok = strip(rt) === strip(tgt);
console.log(ok ? 'NEAR-EXACT MATCH: executable runtime identical; only bzzr0 swarm hash differs' : 'FAIL');
process.exit(ok ? 0 : 1);
