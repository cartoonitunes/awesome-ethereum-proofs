#!/usr/bin/env node
/**
 * Reproduce the exact bytecode match for CatCoin (0x8e72a683...).
 *
 * solc 0.1.x emits one of TWO valid code layouts for this source. Which one it
 * emits depends on emscripten heap state, i.e. on how many compilations have
 * already run inside the same module instance:
 *
 *   - first compile in a fresh module  -> layout A (shared string-copy block
 *                                          placed BEFORE the function bodies)
 *   - after >=1 prior compile          -> layout B (block placed at the END)
 *
 * The deployed contract is layout B, which is what you get from browser-solidity
 * (it recompiles on every keystroke, so its module is always warm).
 *
 * This script warms the module, then compiles until it reproduces the on-chain
 * runtime byte-for-byte, and finally checks creation bytecode + constructor args.
 *
 * Usage: node verify.js [path/to/soljson.js]
 */
const fs = require('fs');
const path = require('path');

const SOLJSON = process.argv[2] ||
  path.join(process.env.HOME, '.openclaw/workspace/.cache/soljson/solc-emscripten-asmjs-v0.1.6+commit.d41f8b7c.js');

const here    = __dirname;
const src     = fs.readFileSync(path.join(here, 'CatCoin.sol'), 'utf8');
const runtime = fs.readFileSync(path.join(here, 'target_runtime.txt'), 'utf8').trim();
const onchain = fs.readFileSync(path.join(here, 'target_creation.txt'), 'utf8').trim();

const M  = require(SOLJSON);
const cj = M.cwrap('compileJSON', 'string', ['string', 'number']);

for (let i = 0; i < 200; i++) {
  // warm the heap the way an interactive editor session would
  try { cj('contract D' + i + ' { uint x; bytes b; function f(uint a){ x+=a; b.push(1);} }', 1); } catch (e) {}

  let out;
  try { out = JSON.parse(cj(src, 1)); } catch (e) { continue; }
  const c = out.contracts && out.contracts['MyToken'];
  if (!c) continue;

  if (c.runtimeBytecode === runtime) {
    const args = onchain.slice(c.bytecode.length);
    console.log('runtime bytecode      : EXACT MATCH (' + runtime.length / 2 + ' bytes)');
    console.log('creation is prefix    : ' + onchain.startsWith(c.bytecode));
    console.log('creation + ctor args  : ' + ((c.bytecode + args) === onchain ? 'EXACT MATCH' : 'MISMATCH'));
    console.log('constructor args      : ' + args.length / 2 + ' bytes');
    console.log('reproduced on warm iteration ' + i);
    process.exit(0);
  }
}
console.error('no exact match in 200 attempts');
process.exit(1);
