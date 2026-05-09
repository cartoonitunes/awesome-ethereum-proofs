# Z≡N Coin Verification

| Field | Value |
|-------|-------|
| Address | `0xc89886ea1a98255087066bc30e45fcaa320730bd` |
| Deployed | Mar 28, 2016 (block 1,234,447) |
| Deployer | `0x5c883b7812936c8b6e0ce99df60a4e25286e9dcb` |
| Tx | `0x067f2c439cec894d329d8859a0c335f85dd73ad1fe49018f2ce01ed2a57adc03` |
| Compiler | soljson v0.3.1+commit.c492d9be |
| Optimizer | ON |
| Runtime | 2,454 bytes |
| Runtime SHA-256 | `729e01d24e94c5a67c3ee263a448a5f2f443003e462311fa0c96496669a81b61` |
| Proved by | [@Neo](https://ethereumhistory.com/historian/neo-by-cart00n) |
| Verification | `source_reconstructed` — 22/22 selectors and storage slots match; 238-byte dispatcher byte-identical |

## Token Details

| Field | Value |
|-------|-------|
| Name | Z≡N Coin |
| Symbol | Z≡N |
| Decimals | 2 |
| Initial Supply | 1,000 (= 100,000 base units) |
| Buy price | 0.01 ETH per Z≡N |
| Sell price | 0.1 ETH per Z≡N (10× spread) |

## Verification

```bash
node verify.js
```

The script downloads soljson v0.3.1+commit.c492d9be, compiles `ZNCoin.sol` with optimizer
ON, and compares the produced runtime against the on-chain runtime in `target_runtime.txt`.

## Source

`ZNCoin.sol` is a near-verbatim instance of the ConsenSys MyAdvancedToken extended
template (the late-2015/early-2016 ethereum.org "advanced token" tutorial), with
tokenName `"Z≡N Coin"`, tokenSymbol `"Z≡N"`, decimalUnits `2`, initialSupply `1000`,
sellPrice `100000000000000000` (0.1 ETH), buyPrice `10000000000000000` (0.01 ETH).

## Why source_reconstructed (not exact match)

All 22 dispatch selectors and all 11 storage slot positions match exactly. The first
238 bytes (the full dispatcher) are byte-identical, and function bodies through
`e4849b32` (sell) sit at the same code addresses on chain as in the rebuild.

The 64-byte size delta is concentrated in two spots:

1. **+2 bytes** inside `sell()`: the rebuild emits a `PUSH1 0` to initialize the
   named return variable `revenue` that the original solc build elided, keeping
   the equivalent value implicitly on the EVM stack instead.
2. **+62 bytes** in the trailer (the post-dispatcher shared-tail region of the
   sell function). The rebuild and the original use slightly different inlining
   for the final `Transfer` event emission and the return-value setup. Same
   stack effect, different shape.

These are body-placement choices the early-2016 solc optimizer made; matching
them exactly would require pinning down the precise commit / nightly that was
used in March 2016. The semantic, storage, and ABI surfaces are identical.

## Related

Full repo with on-chain hex and shell verifier:
[cartoonitunes/zencoin-verification](https://github.com/cartoonitunes/zencoin-verification)
