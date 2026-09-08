# SmartWallet (linked SmartWalletLib, 0xfc247caf) — Runtime Bytecode Proof

Bancor-lineage per-user withdrawal wallet: `wallet()` returns a
`SmartWalletLib.Wallet` struct held in a single storage slot; owner-facing
functions (`setUserWithdrawalAccount`, `transferToUserWithdrawalAccount`,
`requestWithdraw`, `performUserWithdraw`) forward to library entry points on
`SmartWalletLib`, which is deployed once and linked into every SmartWallet
instance.

The source is the same Bancor SmartWallet already Etherscan-verified at
[`0x2df514a0…6d15`](https://etherscan.io/address/0x2df514a060bbd105ea428182e8b140454f426d15#code)
(compiler `v0.4.24+commit.e67f0147`, optimizer ON, `runs=200`, matching
swarm metadata hash `0x5073597116b7…`). The ONLY difference between the
reference deployment's on-chain runtime and this target's on-chain runtime
is the linked `SmartWalletLib` address, which is embedded at exactly four
positions in the runtime bytecode.

| Field | Value |
|-------|-------|
| Address | `0xfc247caf612c0e82f6dee14294e7ddfa07bea350` |
| Deployed | Sep 27, 2018 |
| Compiler | soljson-v0.4.24+commit.e67f0147 |
| Optimizer | ON, runs=200 |
| Runtime | 971 bytes — **exact byte-for-byte match** (after library link substitution) |
| Runtime SHA-256 | `eb58e441b943f2e60567b75fff79bca03390df768be9523a02048e5118a996b9` (recomputed by `verify.js`) |
| Reference verified deployment | [`0x2df514a060bbd105ea428182e8b140454f426d15`](https://etherscan.io/address/0x2df514a060bbd105ea428182e8b140454f426d15#code) |
| Reference-linked library | `0x4a3cc40b9c78ca394e288e0f645907a8a8fcefca` |
| Target-linked library | `0x74ba8c8f53809bd3baa0c243350cb989f6c9dc3c` |
| Cluster | 7,847 identical-runtime deployments (same target library link) |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Scope

Exact byte-for-byte match of the on-chain runtime. Confirmed by fetching the
Etherscan-verified reference runtime, substituting the reference library
address with the target's linked library address (4 substitutions), and
comparing against the target's on-chain `eth_getCode`.

Both the reference and target compile from the same source (matching swarm
metadata hash). Creation bytecode is not proved here because construction
depends on constructor arguments (operator, feesAccount) that differ per
deployment; the runtime is what identifies the contract's behavior.

## Verify

Requires `ETHERSCAN_API_KEY` in the environment.

```
ETHERSCAN_API_KEY=... node verify.js
```

Exit 0 = exact byte-for-byte match.

## Files

- `SmartWallet.sol` — reconstructed source (attribution line at top does not
  affect bytecode); identical to Etherscan's verified copy at the reference
  deployment.
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`).
- `verify.js` — reproducible script that fetches the reference verified
  runtime, applies the library address substitution, and asserts byte-match.
