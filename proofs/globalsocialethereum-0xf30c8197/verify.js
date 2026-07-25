#!/usr/bin/env node
// Near-exact verification of GlobalSocialEthereum (GSE) 0xf30c8197dc89f1336d38a0efb7ad8440fa5b155c.
// A renamed copy of the verified SiaCashCoin airdrop template (EsseChain clone family),
// compiled with an older soljson v0.4.23 (optimizer ON, 200 runs) — which emits extra
// address-masking that v0.4.25 optimizes away, giving the 3809-byte runtime. The deployed
// runtime matches on-chain byte-for-byte; only the trailing bzzr0 swarm hash differs ->
// near_exact_match. Runtime exposes a public SiaCashCoin() (unrenamed constructor, 0x9a4b19e4).
const fs = require('fs');
const compileStandard = require('./soljson-v0.4.23.js').cwrap('compileStandard', 'string', ['string']);
const input = { language: 'Solidity', sources: { 'GlobalSocialEthereum.sol': { content: fs.readFileSync('GlobalSocialEthereum.sol', 'utf8') } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { '*': { '*': ['evm.deployedBytecode.object'] } } } };
const out = JSON.parse(compileStandard(JSON.stringify(input)));
const rt = out.contracts['GlobalSocialEthereum.sol'].GlobalSocialEthereum.evm.deployedBytecode.object.toLowerCase();
const tgt = fs.readFileSync('onchain_runtime.hex', 'utf8').trim().replace(/^0x/, '').toLowerCase();
const strip = s => s.replace(/a165627a7a72305820[0-9a-f]{64}0029$/, '');
console.log('compiled runtime:', rt.length / 2, 'bytes   on-chain:', tgt.length / 2, 'bytes');
const ok = strip(rt) === strip(tgt);
console.log('full match:', rt === tgt);
console.log(ok ? 'NEAR-EXACT MATCH: executable runtime identical; only bzzr0 swarm hash differs' : 'FAIL');
process.exit(ok ? 0 : 1);
