# Ethereum Foundation Multisig Wallet Proxy (0xedf619)

## Contract Details

| Field | Value |
|-------|-------|
| Address | `0xedf619865c8303e591ad2c4b373aae82997b337a` |
| Deployed | August 11, 2015 (block 68,436) |
| Deployer | `0xd268fb48fa174088a25a120aff0fd8eb0c2d4c87` |
| Tx Hash | `0x5f0cb0dc62ee9dd39a6efc98e82ca1462add01ac9f2451719fb939a892c6aad4` |
| Compiler | Hand-crafted EVM assembly (not compiled from high-level language) |
| Optimizer | N/A |
| Runtime | 45 bytes |
| Creation | 489 bytes (329 bytes init + 160 bytes ABI-encoded constructor args) |
| Runtime SHA-256 | `9ac9811886b2532e0941de06788b122215ed3747c1d1523627e179e0f4241cc5` |
| Creation SHA-256 | `23cbae6ff632bed4815f6c366441bcb61fe5da1ea3a2f0af9e75d35463333fcf` |
| Verification Status | Exact bytecode match to source |
| Verification Method | `exact_bytecode_match` |
| Source | [ethereum/meteor-dapp-wallet](https://github.com/ethereum/meteor-dapp-wallet) commit [`12623c4`](https://github.com/ethereum/meteor-dapp-wallet/commit/12623c4) |

## Overview

This is a **CALLCODE proxy** for the Ethereum Foundation's multisig wallet. The deployed runtime is only 45 bytes — a hand-crafted EVM assembly stub that forwards all calls (with value) to a shared wallet library at `0xd658a4b8247c14868f3c512fa5cbb6e458e4a989`.

The proxy pattern was the precursor to modern upgradeable proxy contracts (EIP-1167). It uses `CALLCODE` instead of `DELEGATECALL` (which didn't exist yet in Frontier).

## Source

The creation bytecode was found **byte-for-byte identical** in:

| | |
|---|---|
| Repository | [ethereum/meteor-dapp-wallet](https://github.com/ethereum/meteor-dapp-wallet) |
| File | `app/client/lib/ethereum/walletABI.js`, line 5 |
| Variable | `walletStubABICompiled` |
| Commit | [`12623c4`](https://github.com/ethereum/meteor-dapp-wallet/commit/12623c4) — August 4, 2015 17:40 UTC+2 |
| Author | Fabian Vogelsteller (Ethereum Foundation) |
| URL | https://github.com/ethereum/meteor-dapp-wallet/blob/12623c4/app/client/lib/ethereum/walletABI.js#L5 |

The first 329 bytes of the on-chain creation bytecode match the source exactly. The remaining 160 bytes are ABI-encoded constructor arguments appended at deployment time.

## Runtime Bytecode (45 bytes)

```
CALLDATASIZE         ; push calldata size
PUSH1 0x0            ; push 0 (memory destination)
DUP1                 ; reuse 0 (calldata source offset)
CALLDATACOPY         ; copy calldata to memory[0]
PUSH1 0x20           ; return size (32 bytes)
PUSH1 0x0            ; return offset
CALLDATASIZE         ; input size
PUSH1 0x0            ; input offset
CALLVALUE            ; msg.value
PUSH20 <library>     ; 0xd658a4b8247c14868f3c512fa5cbb6e458e4a989
PUSH2 0x235a         ; 9050 gas reserve
GAS                  ; remaining gas
SUB                  ; gas - 9050
CALLCODE             ; forward call to library
PUSH1 0x20           ; return 32 bytes
PUSH1 0x0            ; from offset 0
RETURN               ; return result
```

## Wallet Library

The implementation at `0xd658a4b8247c14868f3c512fa5cbb6e458e4a989` is a Gavin Wood multisig wallet (4,031 bytes) with 17 functions:

| Selector | Function |
|----------|----------|
| 0x173825d9 | removeOwner(address) |
| 0x2f54bf6e | isOwner(address) |
| 0x4123cb6b | m_numOwners() |
| 0x52375093 | m_lastDay() |
| 0x54fd4d50 | version() |
| 0x5c52c2f5 | resetSpentToday() |
| 0x659010e7 | m_spentToday() |
| 0x7065cb48 | addOwner(address) |
| 0x746c9171 | m_required() |
| 0x797af627 | confirm(bytes32) |
| 0xb20d30a9 | setDailyLimit(uint256) |
| 0xb61d27f6 | execute(address,uint256,bytes) |
| 0xb75c7dc6 | revoke(bytes32) |
| 0xba51a6df | changeRequirement(uint256) |
| 0xc2cf7326 | hasConfirmed(bytes32,address) |
| 0xcbf0b0c0 | kill(address) |
| 0xf00d4b5d | changeOwner(address,address) |

The wallet library source (`wallet.sol`) was written by Gavin Wood on January 22, 2015 (commit `a7116b7` in [ethereum/dapp-bin](https://github.com/ethereum/dapp-bin)).

## Constructor Arguments

| Arg | Value | Meaning |
|-----|-------|---------|
| 0 | 0x60 | Offset to address array |
| 1 | 0 | Required confirmations |
| 2 | 100,000,000 × 10^18 | Daily spending limit |
| 3 | 1 | Number of owners |
| 4 | `0xd268fb48fa174088a25a120aff0fd8eb0c2d4c87` | Owner address |

## Evolution of the Proxy Stub

| Date | Commit | Size | Gas Reserve | Notes |
|------|--------|------|-------------|-------|
| Aug 4, 2015 13:32 | `f419e47` | 44 bytes | 50 | First version, library `0xbfa69ba9...` |
| Aug 4, 2015 17:40 | **`12623c4`** | **45 bytes** | **9050** | **Our contract's exact source** |
| Aug 11, 2015 | — | 45 bytes | 9050 | Contract deployed on mainnet |
| Later 2015 | — | 49 bytes | 9050 | ISZERO safety check added |

## Reconstructed Source (Serpent)

The file `reconstructed.se` is the closest high-level source approximation, written in [Serpent](https://github.com/ethereum/serpent):

```serpent
~calldatacopy(0, 0, ~calldatasize())
~callcode(~gas() - 9050, 0xd658a4b8247c14868f3c512fa5cbb6e458e4a989, callvalue(), 0, ~calldatasize(), 0, 32)
~return(0, 32)
```

This produces a **47-byte** runtime — 2 bytes larger than the original 45 bytes. The differences:

| # | Serpent (47 bytes) | Original (45 bytes) | Savings |
|---|---|---|---|
| 3 | `PUSH1 0x0` (2 bytes) | `DUP1` (1 byte) — reuses 0 already on stack | 1 byte |
| 14 | `POP` (1 byte) — discards CALLCODE return value | *(nothing)* — leaves it on stack, ignored | 1 byte |

All other 15 instructions are **identical** between Serpent and the original.

## Compiler Analysis

The proxy runtime was **not compiled from any high-level language**. Testing 56 compilers:

| Compiler | Versions Tested | Closest Match |
|----------|----------------|---------------|
| Solidity | 42 builds (0.0.8–0.3.6) | 109 bytes (2.4× too large) |
| Serpent | 14 commits (2014–2015) | 47 bytes (2 bytes off) |

The Serpent gas reserve of **9045** (hardcoded in `rewriter.cpp`, commit `1422ad1` by Vitalik Buterin) is close to the contract's **9050** — confirming the proxy was designed in the Serpent ecosystem, then hand-optimized for minimal size.

## Related Contracts

### Proxy Instances (same 45-byte stub code)

All three proxies use identical runtime bytecode, forwarding to the same wallet library via CALLCODE:

| Address | Ethereum History |
|---------|-----------------|
| `0xedf619865c8303e591ad2c4b373aae82997b337a` | [ethereumhistory.com](https://www.ethereumhistory.com/contract/0xedf619865c8303e591ad2c4b373aae82997b337a) |
| `0x93e8f703c29337500d426549633f2be43d63a0fa` | [ethereumhistory.com](https://www.ethereumhistory.com/contract/0x93e8f703c29337500d426549633f2be43d63a0fa) |
| `0x45f4054e7384d9c4b5be63d3927d9b7d18781fdc` | [ethereumhistory.com](https://www.ethereumhistory.com/contract/0x45f4054e7384d9c4b5be63d3927d9b7d18781fdc) |

### Wallet Library (implementation)

| Address | Ethereum History |
|---------|-----------------|
| `0xd658a4b8247c14868f3c512fa5cbb6e458e4a989` | [ethereumhistory.com](https://www.ethereumhistory.com/contract/0xd658a4b8247c14868f3c512fa5cbb6e458e4a989) |

The library contains the full multisig wallet logic (4,031 bytes, 17 functions). All proxy instances share this single library — only the constructor arguments (owners, required confirmations, daily limit) differ between proxy deployments.

## Verification

Run `node verify.js` to verify. The script:

1. Downloads `walletStubABICompiled` from GitHub (329 bytes)
2. Appends the constructor arguments (160 bytes)
3. Extracts the 45-byte runtime from the template
4. Compares against `target_runtime.txt`

```
on-chain creation tx input = source template (329 bytes) + constructor args (160 bytes)
deployed runtime code      = last 45 bytes of source template
```

Proved by [@gpersoon](https://www.ethereumhistory.com/historian/169)
