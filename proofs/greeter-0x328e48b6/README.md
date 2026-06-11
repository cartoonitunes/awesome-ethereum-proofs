# greeter -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x328e48b6cd2b5401c42dc96b8495eba09b2a4a9f` |
| Deployed | Oct 28, 2015 (block 450,376) |
| Compiler | soljson v0.1.5+commit.23865e39 |
| Optimizer | ON |
| Runtime | 366 bytes |
| Creation | 670 bytes |
| Runtime SHA-256 | `405323340e37a215b653b4048feae02c41756a4e065f6efc24d6bb27803af477` |
| Creation SHA-256 | `6f960305b34c89a828136222d42757fa45d980b376ef22f3fd90d0fe4033b91f` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

The canonical ethereum.org "Hello World" greeter (`mortal` base + `greeter`): `greet()` returns a stored greeting string, `kill()` selfdestructs to the owner. Compiled with soljson v0.1.5, optimizer ON.

One of **68 identical-runtime deployments** (41 still live on-chain, 27 since self-destructed; see `addresses.json`). The representative above is live — verify its runtime with `eth_getCode`.

## Verification

```bash
node verify.js
```

Downloads soljson-v0.1.5, compiles `greeter.sol` (optimizer ON), and confirms the compiled runtime is a byte-for-byte match against `target_runtime.txt` (= the on-chain runtime of the address above).
