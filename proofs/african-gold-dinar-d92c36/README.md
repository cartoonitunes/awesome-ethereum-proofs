# African Gold Dinar (D)

April 2016 mint-and-trade token from the `MyToken` Ethereum-tutorial lineage. Standard balance / allowance / freeze / mint / buy / sell surface, with the constructor never setting `buyPrice` or `sellPrice` — both stay at zero until the owner calls `setPrices()`, so `buy()` divides by zero and reverts and `sell()` returns nothing until prices are configured.

| Field | Value |
|-------|-------|
| Address | `0xd92C36F15a43B97A19bfa5Fc25a025B19946e4E6` |
| Deployed | Apr 2, 2016 (block 1,261,284) |
| Deployer | `0x28ba0b04488b9fb1f50f9b9ef782a9899855a5d6` |
| Deploy tx | `0x417de6c36d1b9047c931af008b6da60ba00d54ba88677857d6f2bb678e104532` |
| Compiler | soljson v0.2.1+commit.91a6b35f |
| Optimizer | ON |
| Runtime | 2,346 bytes |
| Creation | 3,121 bytes (2,833 code + 288 constructor args) |
| Runtime SHA-256 | `5bcf41862ed3c02bf976b5dd34cb623ab6ef40775dbd9c54cefd2b29b29069b1` |
| Creation SHA-256 | `4fe71400eb256a617b27e443861f159421b45120770a91caad98eab7d6f89422` |
| Token name / symbol | `African Gold Dinar` / `D` |
| Decimals | 3 |
| Initial supply | 200,000,000 base units (200,000.000 D) |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.2.1+commit.91a6b35f`, compiles `MyToken.sol` with the optimizer ON, and confirms the SHA-256 of the compiled runtime equals `5bcf4186…`. Output ends with `VERIFIED: exact bytecode match`.

## Constructor arguments (288 bytes ABI-encoded)

The 288 bytes appended to the compiled creation code at the deploy tx:

| Param | Value |
|---|---|
| `initialSupply` (uint256) | `200000000` (0x0bebc200) |
| `tokenName` (string) | `"African Gold Dinar"` (`0x4166726963616e20476f6c642044696e6172`) |
| `decimalUnits` (uint8) | `3` |
| `tokenSymbol` (string) | `"D"` (`0x44`) |
| `centralMinter` (address) | `0x28ba0b04488b9fb1f50f9b9ef782a9899855a5d6` (same as deployer) |

`centralMinter != 0`, so the constructor sets `owner = msg.sender`, which is the deployer. With 3 decimals the initial supply represents 200,000.000 D tokens credited to the deployer.

## Compiler note

EthereumHistory's first verification recorded `native solc v0.1.5` as the compiler. That was wrong: v0.1.5 emits the pre-nightly identity-precompile gas formula (`words*3 + 15`) in the public-string getter helper, while the on-chain bytecode uses the swapped formula (`words*15 + 3`) that solc adopted in `v0.1.7-nightly.2015.11.19+commit.58110b27` and kept through v0.3.2. Sweeping the v0.2.x–v0.3.2 range against this source confirms an identical runtime and creation bytecode; v0.2.1 (Sep 2016) is the earliest officially-released soljson that matches both creation and runtime exactly (v0.2.0 matches runtime but differs by 3 bytes in the constructor wrapper).

## Files

- `MyToken.sol` — reconstructed source (single file, three contracts: `owned`, `tokenRecipient`, `MyToken`)
- `target_runtime.txt` — on-chain runtime hex (2,346 bytes)
- `verify.js` — Node verification script
