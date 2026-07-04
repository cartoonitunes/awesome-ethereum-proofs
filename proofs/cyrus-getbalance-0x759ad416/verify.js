#!/usr/bin/env node
// Byte-for-byte verification of Cyrus Adkisson's GetBalance (0x759ad416...)
// Compiler: soljson v0.1.1 (commit 6ff4cd6), optimizer OFF.
// The on-chain creation bytecode is reproduced exactly; the deployed runtime is
// the CODECOPY'd tail of that creation, so an exact creation match proves the
// runtime match. (v0.1.1's emscripten runtimeBytecode output field is broken.)
const fs = require('fs');
const solc = require('solc');
const input = fs.readFileSync('GetBalance.sol', 'utf8');
const compiler = solc.setupMethods(require('./soljson-v0.1.1.js'));
let out = compiler.compile(input, 0);
if (typeof out === 'string') out = JSON.parse(out);
const c = out.contracts[':GetBalance'] || out.contracts['GetBalance'];
const mine = c.bytecode;
const target = fs.readFileSync('target_creation.hex', 'utf8').trim();
console.log('compiled creation:', mine.length/2, 'bytes');
console.log('on-chain creation:', target.length/2, 'bytes');
if (mine === target) {
  // verify embedded runtime equals deployed runtime
  const dep = fs.readFileSync('target_runtime.hex','utf8').trim();
  const off = 0x50, len = 0x9b;
  const embedded = mine.slice(off*2, (off+len)*2);
  console.log('VERIFIED: creation exact; embedded runtime == deployed:', embedded === dep);
} else {
  console.log('MISMATCH'); process.exit(1);
}
