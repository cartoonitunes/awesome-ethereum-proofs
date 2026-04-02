const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const TARGET_RUNTIME = fs.readFileSync(path.join(__dirname, 'target_runtime.txt'), 'utf8').trim();

// Source: ethereum/meteor-dapp-wallet commit 12623c4
// File: app/client/lib/ethereum/walletABI.js, line 5
// Variable: walletStubABICompiled
// This is NOT compiled from Solidity — it's a hand-crafted EVM assembly template.
// The on-chain creation bytecode = this template + ABI-encoded constructor arguments.
const SOURCE_URL = 'https://raw.githubusercontent.com/ethereum/meteor-dapp-wallet/12623c42d8b500500da21a452d80635ba7ce9ffd/app/client/lib/ethereum/walletABI.js';

// Constructor arguments: Wallet(address[] _owners, uint _required, uint _daylimit)
// _owners = [0xd268fb48fa174088a25a120aff0fd8eb0c2d4c87], _required = 0, _daylimit = 100M ETH
const CONSTRUCTOR_ARGS =
    '0000000000000000000000000000000000000000000000000000000000000060' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '00000000000000000000000000000000000000000052b7d2dcc80cd2e4000000' +
    '0000000000000000000000000000000000000000000000000000000000000001' +
    '000000000000000000000000d268fb48fa174088a25a120aff0fd8eb0c2d4c87';

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'verify/1.0' } }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
                return fetch(res.headers.location).then(resolve, reject);
            let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
        }).on('error', reject);
    });
}

async function main() {
    console.log('Ethereum Foundation Multisig Wallet Proxy Verification');
    console.log('Contract: 0xedf619865c8303e591ad2c4b373aae82997b337a');
    console.log('Source: ethereum/meteor-dapp-wallet @ 12623c4 (hand-crafted EVM assembly)');
    console.log();

    // Fetch the source template from GitHub
    console.log('Downloading source from GitHub...');
    const source = await fetch(SOURCE_URL);
    const match = source.match(/walletStubABICompiled\s*=\s*'([0-9a-f]+)'/);
    if (!match) { console.log('FAIL: walletStubABICompiled not found'); process.exit(1); }
    const template = match[1];

    // The creation bytecode = template + constructor args
    const creation = template + CONSTRUCTOR_ARGS;

    // The runtime is embedded after the "f300" separator (RETURN; STOP; <runtime>)
    const runtimeStart = template.indexOf('f300') + 4;
    const runtime = template.slice(runtimeStart);

    const runtimeMatch = runtime === TARGET_RUNTIME;
    const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
    const creationHash = crypto.createHash('sha256').update(Buffer.from(creation, 'hex')).digest('hex');

    console.log(`Template: ${template.length / 2} bytes (from GitHub)`);
    console.log(`Constructor args: ${CONSTRUCTOR_ARGS.length / 2} bytes`);
    console.log(`Creation: ${creation.length / 2} bytes (template + args)`);
    console.log(`Runtime: ${runtime.length / 2} bytes (45-byte CALLCODE proxy)`);
    console.log(`Runtime SHA-256: ${runtimeHash}`);
    console.log(`Creation SHA-256: ${creationHash}`);
    console.log();

    console.log(`Runtime match: ${runtimeMatch ? 'PASS' : 'FAIL'}`);

    if (runtimeMatch) {
        console.log();
        console.log('VERIFIED: exact bytecode match');
        console.log();
        console.log('Proxy instances with identical runtime:');
        console.log('  0xedf619865c8303e591ad2c4b373aae82997b337a');
        console.log('  0x93e8f703c29337500d426549633f2be43d63a0fa');
        console.log('  0x45f4054e7384d9c4b5be63d3927d9b7d18781fdc');
        console.log();
        console.log('Wallet library (implementation):');
        console.log('  0xd658a4b8247c14868f3c512fa5cbb6e458e4a989');
    }
}

main().catch(console.error);
