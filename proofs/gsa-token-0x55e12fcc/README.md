# GSA token Verification

Five deployments made inside three hours on 12 July 2016, all from one reconstructed source. No published source for this contract exists anywhere: the Solidity here was rebuilt from the deployed bytecode alone.

The route in was the storage layout. The function bodies are the ConsenSys `StandardToken` implementations, but the state variables are declared in a different order, `totalSupply` first and then `name`, `symbol`, `decimals`, which is visible in the slot assignments of the decompiled contract. Recovering that order was what made the match possible.

One file reproduces all five contracts byte for byte, runtime and creation both, across three different build settings: v0.3.2 with the optimizer on, v0.3.5 with it on, and v0.3.5 with it off. A source that matches a single contract can be a coincidence of size; the same file matching five contracts under three builds is not.

Three of the five (`0x55e12fcc`, `0x174d65E1` and `0xE7228a4D`) were deployed with no constructor arguments, so their name, symbol and supply read as empty and zero on chain to this day. That is reproduced exactly: their creation payload is the compiled creation code with nothing appended.

## Contracts

| Address | Deployed | Compiler | Optimizer | Runtime | Proof covers |
|---|---|---|---|---|---|
| [`0x55e12fcc775E6cEec63b4D1F32F7d1B621275A9F`](https://ethereumhistory.com/contract/0x55e12fcc775E6cEec63b4D1F32F7d1B621275A9F) | Jul 12, 2016 (block 1,870,577) | soljson-v0.3.5+commit.5f97274a | ON | 1175 bytes | runtime + creation |
| [`0x174d65E160e78791dd5f1538bBc4625A186C2254`](https://ethereumhistory.com/contract/0x174d65E160e78791dd5f1538bBc4625A186C2254) | Jul 12, 2016 (block 1,870,605) | soljson-v0.3.5+commit.5f97274a | ON | 1175 bytes | runtime + creation |
| [`0xC120317441b91413fbF70dCAD64c7E282e586832`](https://ethereumhistory.com/contract/0xC120317441b91413fbF70dCAD64c7E282e586832) | Jul 12, 2016 (block 1,871,205) | soljson-v0.3.2+commit.81ae2a78 | ON | 1196 bytes | runtime + creation |
| [`0xE7228a4D9Aad7a1D5b4819cF93C09b307008047b`](https://ethereumhistory.com/contract/0xE7228a4D9Aad7a1D5b4819cF93C09b307008047b) | Jul 12, 2016 (block 1,871,236) | soljson-v0.3.5+commit.5f97274a | OFF | 2314 bytes | runtime + creation |
| [`0x91CB0BaA273eef05BaF6A301c086d58c4e44d73d`](https://ethereumhistory.com/contract/0x91CB0BaA273eef05BaF6A301c086d58c4e44d73d) | Jul 12, 2016 (block 1,871,251) | soljson-v0.3.5+commit.5f97274a | OFF | 2314 bytes | runtime + creation |

## Hashes

| Address | Runtime SHA-256 | Creation SHA-256 |
|---|---|---|
| `0x55e12fcc…` | `abe1152e25e809b3b502f5cc4253a1cb3efcbbea5faa7926d4d2fa5e745a1607` | `aef5720e997df1906a8dc3ec93bc86fdbb4b01f558922613d272daf77bf5bcc9` |
| `0x174d65E1…` | `abe1152e25e809b3b502f5cc4253a1cb3efcbbea5faa7926d4d2fa5e745a1607` | `aef5720e997df1906a8dc3ec93bc86fdbb4b01f558922613d272daf77bf5bcc9` |
| `0xC1203174…` | `eccc474529c2e97a45e28449552bb2378d5a43d7fae4c431df669570c15e2a5e` | `bdf221044220b93d26eacdbc5d2678d410f2a7cf1c23bae9a6d42aad6adf0dd1` |
| `0xE7228a4D…` | `3a77002b7cb42b0529ce408214279f15dd63e618c3e53a1a87f6fa8836aa63df` | `6471746cd0c20cbfe6e627940d974e2400831eba389eb131e3d4c6b47b647d6d` |
| `0x91CB0BaA…` | `3a77002b7cb42b0529ce408214279f15dd63e618c3e53a1a87f6fa8836aa63df` | `86a3d36617ca27b35bb247db72c8c11eb52d8e2d7475e2e83fc585fbb46a52ab` |

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

- `GSAToken.sol`
- `addresses.json`
- `creation_0x174d65e1.txt`
- `creation_0x55e12fcc.txt`
- `creation_0x91cb0baa.txt`
- `creation_0xc1203174.txt`
- `creation_0xe7228a4d.txt`
- `manifest.json`
- `runtime_0x174d65e1.txt`
- `runtime_0x55e12fcc.txt`
- `runtime_0x91cb0baa.txt`
- `runtime_0xc1203174.txt`
- `runtime_0xe7228a4d.txt`
- `verify.js`
