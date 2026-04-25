# BitnationShares Token Verification

Bytecode verification proof for the Bitnation Shares (XBN) token deployed by Alex Van de Sande (avsa) on February 17, 2016, as part of Bitnation's migration to Ethereum.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xedb37809291efbc00cca24b630c3f18c2a98f144` |
| Deployed | Feb 17, 2016 (block 1,019,907) |
| Deployer | `0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb` (alex.vandesande.eth) |
| Compiler | soljson v0.2.2+commit.ef92f566 |
| Optimizer | ON |
| Runtime | 1416 bytes |
| Runtime SHA-256 | `da45fa96375d1b1bc75ab05ed84954a1436b65a1f176c75389ce059780efc825` |

## Notes

AVSA's token tutorial variant with a `spentAllowance` mapping that tracks total allowance already spent, enabling secure `transferFrom` without resetting the full allowance. The `approve` function calls back the spender via the `tokenRecipient` interface (`sendApproval`), an early callback pattern predating ERC-677.

Two key source details recovered by bytecode analysis:
- `approve` uses the `tokenRecipient` interface (no return-value check on the call), not a raw `.call()`
- `transferFrom` emits `Transfer(msg.sender, _to, _value)` — a bug where `msg.sender` was used instead of `_from`

Multiple soljson versions (v0.2.1 and v0.2.2) produce identical output. v0.2.2 is listed as the latest stable at deployment time.

## Verification

```bash
node verify.js
```

## Source

See `BitnationShares.sol` in this directory.
