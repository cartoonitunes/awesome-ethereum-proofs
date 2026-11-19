# DepositWallet with collectToken (0x55166ecb) — Runtime + Creation Bytecode Proof

A 2017-vintage owner-controlled deposit forwarder: a payable fallback that logs
`Deposit(address indexed from, uint256 value, uint256 indexed data)` when ETH
arrives (with the literal `88` as the indexed `data`), an owner-only `collect()`
that sends the whole ETH balance to the owner, an owner-only `kill()`
selfdestruct, and — the distinguishing feature vs the earlier depositwallet
variants — an owner-only `collectToken(address token, address to, uint256 amount)`
that sweeps a specific ERC-20 balance via a low-level `Token.transfer` call.

| Field | Value |
|-------|-------|
| Address | `0x55166ecb1b5b628b028ec0c0b468b68ea7208b62` |
| Deployed | Mar 22, 2017 (block 3,398,048) |
| Deployer | `0x42da8a05cb7ed9a43572b5ba1b8f82a0a6e263dc` |
| Deploy tx | `0xb1b1a3fd2dd93b189a9644d9b960ae11be2e1c8060d3e17d030deca2b20c4ceb` |
| Compiler | soljson-v0.4.4+commit.4633f3de |
| Optimizer | ON |
| Runtime | 400 bytes — **exact byte-for-byte match** |
| Creation | 455 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `ab79f9e7f8993aaefe7a6309e1ba826af05a1046fd6781c53bb20cf31363efbf` |
| Creation SHA-256 | `e17a44dc348c799080f0d18b2399abf62198d8b87d1bf0a1a2cf5be1b7722153` |
| Cluster | 7,123 identical-runtime deployments between 2017-03-22 and 2017-05-31, across 3 deployers (see `addresses.json` for the first 20) |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Scope

Exact match of both the on-chain runtime and creation bytecode, reproduced
by the stock `soljson-v0.4.4+commit.4633f3de` build with the optimizer ON.
Both bytecodes match SHA-256, so any of the 7,123 cluster members deployed
with the same source recovers to this file.

The distinguishing shape (vs `depositwallet-opton-0x0011d2d4` and
`depositwalletv2-opton-0x06e808`, both compiled with soljson-v0.1.3) is the
added `collectToken(address,address,uint256)`. The bytecode reconstruction
turned on a local-alias detail: writing `var t = Token(token); t.transfer(to,
amount);` produces the exact 400-byte output; `Token(token).transfer(to,
amount)` compiles to a 5-byte-shorter body (395B, dispatch offsets shift by
5). That structural signature is what pinned the source.

## Verify

```
node verify.js
```

Exit 0 = both runtime and creation bytecode match SHA-256.

## Files

- `DepositWallet.sol` — reconstructed source (attribution line at top does not
  affect bytecode)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx `input`)
- `verify.js` — reproducible script that downloads the compiler and checks
  both bytecodes byte-for-byte
- `addresses.json` — first 20 cluster members by deployment block; the full
  set of 7,123 is queryable via the EH DB by
  `runtime_bytecode_hash = 96ea6e9d041acf98d1858301313a23cf`
