# Fucks (🖕)

March 2016 mint-and-trade token from the `MyToken` Ethereum-tutorial lineage. Standard balance / allowance / freeze / mint / buy / sell surface, with the twist that the constructor never sets `buyPrice` or `sellPrice` — both stay at zero until the owner calls `setPrices()`, so `buy()` divides by zero and reverts and `sell()` returns nothing until prices are configured.

| Field | Value |
|-------|-------|
| Address | `0xabB6DE07f9Aac9d88bD74Bd931A8bBBce1a1860D` |
| Deployed | Mar 18, 2016 (block 1,173,786) |
| Deployer | `0x2c7bd0008596b2832002d9fdc8253f198dd8b6e0` |
| Deploy tx | `0xcf94e94885b3bef265bc0516654259201621f75e1116b82b6ae7b38e69208e74` |
| Compiler | soljson v0.2.1+commit.91a6b35f |
| Optimizer | ON |
| Runtime | 2,228 bytes |
| Creation | 3,015 bytes (2,727 code + 288 constructor args) |
| Runtime SHA-256 | `d767676e03eec6bfce55c7cb36368fddb6f99b0e8398cf8ee0ab801d9f440a20` |
| Creation SHA-256 | `f814f31cba220e66126229b55acff79cdc840dce3cc5e005024635ca7ee2f109` |
| Token name / symbol | `Fucks` / `🖕` (U+1F595, encoded as `f09f9695`) |
| Decimals | 2 |
| Initial supply | 1,000,000 (constructor sets default when passed 0) |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.2.1+commit.91a6b35f`, compiles `Fucks.sol` with the optimizer ON, and confirms the SHA-256 of the compiled runtime equals `d767676e…`. Output ends with `VERIFIED: exact bytecode match`.

## Constructor arguments (288 bytes ABI-encoded)

The 288 bytes appended to the compiled creation code at the deploy tx:

| Param | Value |
|---|---|
| `initialSupply` (uint256) | `0` → constructor falls back to `1000000` |
| `tokenName` (string) | `"Fucks"` (`0x4675636b73`) |
| `decimalUnits` (uint8) | `2` |
| `tokenSymbol` (string) | `"🖕"` (`0xf09f9695`) |
| `centralMinter` (address) | `0x2c7bd0008596b2832002d9fdc8253f198dd8b6e0` (same as deployer) |

`centralMinter != 0`, so the constructor sets `owner = msg.sender`, which is the deployer.

## Compiler note

EthereumHistory's first verification recorded `native solc v0.1.5` as the compiler. That was wrong: v0.1.5 emits the pre-nightly identity-precompile gas formula (`words*3 + 15`) in the public-string getter helper, while the on-chain bytecode uses the swapped formula (`words*15 + 3`) that solc adopted in `v0.1.7-nightly.2015.11.19+commit.58110b27` and kept through v0.3.2. Sweeping the v0.2.x–v0.3.2 range against this source confirms an identical runtime; v0.2.1 (Feb 2016) is the soljson release closest to the deployment date.

## Files

- `Fucks.sol` — reconstructed source (single file, two contracts: `owned`, `tokenRecipient`, `MyToken`)
- `target_runtime.txt` — on-chain runtime hex (2,228 bytes)
- `verify.js` — Node verification script
