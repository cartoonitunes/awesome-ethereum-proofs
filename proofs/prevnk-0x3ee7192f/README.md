# PreVNK Verification

Four deployments of the same early ERC-20 token, made from the Mist wallet inside 96 minutes on 31 January 2016. The source is not a reconstruction: the deployers published it themselves to [github.com/FreeMyVunk/PreVNK_Token](https://github.com/FreeMyVunk/PreVNK_Token) at 20:31 UTC that evening, nine minutes after the production deployment, and that file recompiles byte for byte to all four runtimes and all four creation payloads.

Two variants are present. `PreVNK.sol` is the published file, in which `issue()` increments the issuer balance. `PreVNK_draft.sol` differs by one character: the earlier deployments assign instead of incrementing, which costs three bytes of runtime. Everything else is identical.

The contract is worth reading for its own comments. It emits a non standard `TransferFrom` event next to `Transfer` because, as the source explains, the standard `Transfer` event alone did not let an observer rebuild balances from logs, and it carries a warning citing Solidity issues 333 and 281 that the statement order inside `transferFrom` must not be rearranged.

## Contracts

| Address | Deployed | Compiler | Optimizer | Runtime | Proof covers |
|---|---|---|---|---|---|
| [`0x3Ee7192F069F3Ab16077f843F2F469bD327e206C`](https://ethereumhistory.com/contract/0x3Ee7192F069F3Ab16077f843F2F469bD327e206C) | Jan 31, 2016 (block 933,869) | soljson-v0.2.0+commit.4dc2445e | ON | 1311 bytes | runtime + creation |
| [`0x610f1d4D442fA91f3a9A9797AcfA78F7a587f701`](https://ethereumhistory.com/contract/0x610f1d4D442fA91f3a9A9797AcfA78F7a587f701) | Jan 31, 2016 (block 933,833) | soljson-v0.2.0+commit.4dc2445e | ON | 1311 bytes | runtime + creation |
| [`0x2B5B9de0652886f471f347163431Bf70d5450333`](https://ethereumhistory.com/contract/0x2B5B9de0652886f471f347163431Bf70d5450333) | Jan 31, 2016 (block 933,537) | soljson-v0.2.0+commit.4dc2445e | ON | 1308 bytes | runtime + creation |
| [`0xBda249e6f813b2e8fd24F36354d2a9f9529149F1`](https://ethereumhistory.com/contract/0xBda249e6f813b2e8fd24F36354d2a9f9529149F1) | Jan 31, 2016 (block 933,757) | soljson-v0.2.0+commit.4dc2445e | ON | 1308 bytes | runtime + creation |

## Hashes

| Address | Runtime SHA-256 | Creation SHA-256 |
|---|---|---|
| `0x3Ee7192F…` | `20c15c5c01b4810c4bd5ecc5ec141473b7cc9c6c2df1e758a4360bf200dc5bc5` | `756c0cfd529ec7b1672bcdb2826b7b0ecb5e51aaeeb81eda9785a512778a775d` |
| `0x610f1d4D…` | `20c15c5c01b4810c4bd5ecc5ec141473b7cc9c6c2df1e758a4360bf200dc5bc5` | `232f3bf81e92e9576a4d6c61082aa31e7ee209248275c2b144d02bf15a5764b3` |
| `0x2B5B9de0…` | `73954e1b12ff9ae55157ec2950a90d54ea5883f8c34430a61d11329344e33564` | `dbd9d1ec991a99fa755bf4026ba42553aa5fc8d6b05cfe874a75ee6bcf337c2d` |
| `0xBda249e6…` | `73954e1b12ff9ae55157ec2950a90d54ea5883f8c34430a61d11329344e33564` | `73904f2d4a11ddfcc42dd363b521890d18159d874a20722142a21ac97470ecc8` |

| | |
|---|---|
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Verify

```
node verify.js
```

The script reads `manifest.json`, downloads each pinned soljson build from
`binaries.soliditylang.org`, compiles the source and compares the result against the
on-chain hex in this folder. Creation code is compared after stripping the ABI encoded
constructor arguments the deploy transaction appends. Exit code 0 means every target
matched.

## Files

- `PreVNK.sol`
- `PreVNK_draft.sol`
- `addresses.json`
- `creation_0x2b5b9de0.txt`
- `creation_0x3ee7192f.txt`
- `creation_0x610f1d4d.txt`
- `creation_0xbda249e6.txt`
- `manifest.json`
- `runtime_0x2b5b9de0.txt`
- `runtime_0x3ee7192f.txt`
- `runtime_0x610f1d4d.txt`
- `runtime_0xbda249e6.txt`
- `verify.js`
