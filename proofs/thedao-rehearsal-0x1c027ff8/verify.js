#!/usr/bin/env node
// Reproducible verification for every contract in this folder.
//
//   node verify.js
//
// Reads manifest.json, downloads each pinned soljson build from
// binaries.soliditylang.org, compiles the source and compares the output against
// the on-chain hex stored here. Creation code is compared after stripping the ABI
// encoded constructor arguments that the deploy transaction appends.
//
// Exit 0 = every target matched.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const CACHE = path.join(require('os').tmpdir(), 'soljson-cache');
const manifest = JSON.parse(fs.readFileSync(path.join(HERE, 'manifest.json'), 'utf8'));

const readHex = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').trim().replace(/^0x/, '').toLowerCase();
const sha256 = (h) => crypto.createHash('sha256').update(Buffer.from(h, 'hex')).digest('hex');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve();
    const f = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      res.pipe(f);
      f.on('finish', () => f.close(resolve));
    }).on('error', reject);
  });
}

// Old soljson builds only speak the legacy compileJSON/compileJSONMulti entry
// points; the modern solc-js wrapper cannot drive them. Each compile runs in its
// own child process because these emscripten heaps are ~1GB apiece.
const CHILD = `
const path = require('path');
const m = require(process.argv[2]);
const source = require('fs').readFileSync(process.argv[3], 'utf8');
const name = process.argv[4];
const optimize = process.argv[5] === '1';
const file = path.basename(process.argv[3]);
let raw;
if (typeof m._compileJSONMulti === 'function') {
  raw = m.cwrap('compileJSONMulti', 'string', ['string', 'number'])(
    JSON.stringify({ sources: { [file]: source } }), optimize ? 1 : 0);
} else {
  raw = m.cwrap('compileJSON', 'string', ['string', 'number'])(source, optimize ? 1 : 0);
}
const out = JSON.parse(raw);
const c = out.contracts[name] || out.contracts[file + ':' + name];
if (!c) { console.error('contract not found: ' + name); process.exit(2); }
process.stdout.write(JSON.stringify({
  runtime: (c.runtimeBytecode || c['bin-runtime'] || '').toLowerCase(),
  creation: (c.bytecode || c.bin || '').toLowerCase(),
}));
`;

(async () => {
  fs.mkdirSync(CACHE, { recursive: true });
  const childPath = path.join(CACHE, '_compile_child.js');
  fs.writeFileSync(childPath, CHILD);

  let pass = 0, fail = 0;
  console.log(`${manifest.name}: ${manifest.targets.length} target(s)\n`);

  for (const t of manifest.targets) {
    const sj = path.join(CACHE, t.soljson);
    await download('https://binaries.soliditylang.org/bin/' + t.soljson, sj);

    let got;
    try {
      got = JSON.parse(execFileSync('node', ['--max-old-space-size=4096', childPath,
        sj, path.join(HERE, t.source), t.contract, t.optimize ? '1' : '0'],
        { encoding: 'utf8', maxBuffer: 1 << 28 }));
    } catch (e) {
      console.log(`FAIL ${t.address}  compile error`);
      fail++; continue;
    }

    const wantRuntime = readHex(t.runtimeFile);
    const wantCreationFull = readHex(t.creationFile);
    const wantCreation = t.ctorArgBytes
      ? wantCreationFull.slice(0, wantCreationFull.length - t.ctorArgBytes * 2)
      : wantCreationFull;

    const rOk = got.runtime === wantRuntime;
    const cOk = !t.claimCreation || got.creation === wantCreation;
    const ok = rOk && cOk;
    ok ? pass++ : fail++;

    console.log(`${ok ? 'OK  ' : 'FAIL'} ${t.address}  ${t.name || ''}`);
    console.log(`     compiler   ${t.soljson.replace('.js', '')}  optimizer ${t.optimize ? 'ON' : 'OFF'}`);
    console.log(`     runtime    ${rOk ? 'match' : 'NO MATCH'}  ${wantRuntime.length / 2} bytes  sha256 ${sha256(wantRuntime)}`);
    if (t.claimCreation) {
      console.log(`     creation   ${cOk ? 'match' : 'NO MATCH'}  ${wantCreation.length / 2} bytes` +
        (t.ctorArgBytes ? ` plus ${t.ctorArgBytes} bytes of constructor args` : ''));
    } else {
      console.log('     creation   not claimed for this address (see README)');
    }
    if (!rOk) console.log(`     got runtime ${got.runtime.length / 2} bytes, wanted ${wantRuntime.length / 2}`);
    if (t.claimCreation && !cOk) console.log(`     got creation ${got.creation.length / 2} bytes, wanted ${wantCreation.length / 2}`);
  }

  console.log(`\n${pass} verified, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
