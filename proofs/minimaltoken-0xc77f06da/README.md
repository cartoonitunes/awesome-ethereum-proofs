# minimal token (0xc77f06da) — Runtime + Creation Bytecode Proof

A bare-bones Homestead-era token (Mar 14 2016): a public `balanceOf` mapping and
a single `transfer` that moves balances and fires the standard `Transfer` event —
with **no overflow/underflow checks** (no `throw` guards in the body). The
constructor takes one `uint256 initialSupply` arg and credits it to the deployer
(this deployment used `initialSupply = 3`).

| Field | Value |
|-------|-------|
| Address | `0xc77f06da4c067cd6bf43c5c6536be69e71494c69` |
| Deployed | Mar 14, 2016 (block 1145833) |
| Deployer | `0x88aa96de94e51d1d00001988e6865c3f49bbe34b` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 184 bytes — **exact byte-for-byte match** |
| Creation | 245 bytes + 32-byte constructor arg — **exact match** |
| Runtime SHA-256 | `e8a107476cf358ddaa0e0aa106814441cf8d1e6759479b8dda14c3293e76cc45` |
| Creation SHA-256 | `19bf8a35348b22b1d7a9a0b5cd4cf883944e77577afc803bc32a72593f469a35` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

Exact match of both on-chain runtime and creation bytecode. Compiling `token.sol`
with soljson-v0.1.3 (optimizer ON) reproduces the 184-byte runtime exactly, and
the 245-byte creation code exactly. The deploy-tx input is that 245-byte creation
followed by the 32-byte ABI-encoded `initialSupply` argument
(`0x…0003`), for 277 bytes total — `verify.js` strips and reports that arg.

The dispatch has two selectors: `balanceOf(address)` (`0x70a08231`, the public
mapping getter) and `transfer(address,uint256)` (`0xa9059cbb`). The transfer body
performs the subtract/add directly with no bounds checks and emits
`Transfer(address indexed, address indexed, uint256)` (LOG3, topic
`0xddf252ad…523b3ef`).

## Verify

```
node verify.js
```

## Files

- `token.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy-tx input, incl. 32-byte ctor arg)
- `verify.js` — reproducible runtime + creation verification (handles the appended arg)
