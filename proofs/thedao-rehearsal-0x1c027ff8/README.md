# TheDAO (rehearsal deployment) Verification

A complete instance of TheDAO, deployed at 19:59 UTC on 29 April 2016, one day before TheDAO opened its own creation period.

The constructor arguments are what identify it. It was built with TheDAO's own curator multisig `0xda4a4626d3e16e094de3225a751aab7128e96526`, the same `DAO_Creator` contract `0x4a574510c7014e4ae985403536074abe582adfc8` that produced TheDAO, and the same 2 ether proposal deposit. Two settings differ, and both only make sense for a rehearsal: the minimum funding goal is one token rather than five million, and the creation window closes at 20:02 UTC, three minutes after deployment, rather than four weeks later.

One detail is worth recording. The Solidity that Etherscan holds for TheDAO itself compiles, under the compiler Etherscan records for it, to 10,837 bytes: an exact match for this contract, and one byte short of TheDAO's own deployed runtime of 10,838 bytes. So this rehearsal, not TheDAO, is what that published source reproduces exactly.

## Contracts

| Address | Deployed | Compiler | Optimizer | Runtime | Proof covers |
|---|---|---|---|---|---|
| [`0x1c027FF8998698C8722D725DE2303f8ed75BC753`](https://ethereumhistory.com/contract/0x1c027FF8998698C8722D725DE2303f8ed75BC753) | Apr 29, 2016 (block 1,427,320) | soljson-v0.3.1-nightly.2016.4.12+commit.3ad5e821 | ON | 10837 bytes | runtime only |

## Hashes

| Address | Runtime SHA-256 | Creation SHA-256 |
|---|---|---|
| `0x1c027FF8…` | `357fc574584e94f3359b545aea92a4e3d53f406400bc7c99f47e42bfd5baa2bc` | `f74674a0fb1b2f29aff52c69acc318e2284044e43da4d05510d185b893b4dd61` |

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

- `DAO.sol`
- `addresses.json`
- `creation_0x1c027ff8.txt`
- `manifest.json`
- `runtime_0x1c027ff8.txt`
- `verify.js`
