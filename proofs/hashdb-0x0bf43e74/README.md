# HashDB Source Reconstruction

Byte-for-byte bytecode verification for [`0x0bf43e7408959fe8030d3729760f179403a20147`](https://etherscan.io/address/0x0bf43e7408959fe8030d3729760f179403a20147).

| Field | Value |
|---|---|
| Contract | `0x0bf43e7408959fe8030d3729760f179403a20147` |
| Network | Ethereum Mainnet |
| Token name | Hash DB Token (KARMA) |
| Deployed | 2017-04-04 (block 3,478,756) |
| Deployer | `0xc0c8d72b8d27d3da7da45fdce4d3b1a72ad12bfc` |
| Compiler | soljson v0.3.5+commit.5f97274a |
| Optimizer | ON |
| Runtime match | EXACT (2,406 bytes) |
| Verification method | exact_bytecode_match |

## Cracking notes

Starting near-match (HashDB_v10b.sol) was 18 bytes off. Three structural fixes closed the gap:

1. **`approveAndCall` uses a local `spender` variable assigned AFTER the allowance SSTORE.** Original probe inlined `tokenRecipient(_spender).receiveApproval(...)`. The on-chain bytecode shows a `DUP5 SWAP1 POP` (local assignment) AFTER the SSTORE, not before. Source must be:
   ```solidity
   allowance[msg.sender][_spender] = _value;
   tokenRecipient spender = tokenRecipient(_spender);
   spender.receiveApproval(msg.sender, _value, this, _extraData);
   ```

2. **`setPrices` uses `&&` not nested-if.** Original probe had `if (totalSupply > 0) { if (newSellPrice > sellPrice) throw; if (newSellPrice > newBuyPrice) throw; }`. The on-chain bytecode has a single short-circuit `EQ DUP1 ISZERO SWAP1 JUMPI` pattern at the head, indicating `&&` form. Furthermore, the SECOND check (newBuyPrice constraint) is NOT guarded by totalSupply — only the first is.
   ```solidity
   if (totalSupply != 0 && newSellPrice > sellPrice) throw;
   if (newSellPrice > newBuyPrice) throw;
   ```

3. **Use `!= 0` not `> 0`.** solc 0.3.5 emits `EQ` (then negate) for `!= 0`, but `SWAP1 GT` for `> 0`. The on-chain code has the EQ form.

## Verification

```bash
node -e "
const fs = require('fs');
const solc = require('/tmp/soljson/node_modules/solc');
const soljson = require('/tmp/soljson/soljson-v0.3.5+commit.5f97274a.js');
const compiler = solc.setupMethods(soljson);
const source = fs.readFileSync('HashDB.sol', 'utf8');
const result = compiler.compile(source, 1);
const bytecode = result.contracts['HashDB'].runtimeBytecode;
fs.writeFileSync('runtime_compiled.hex', bytecode);
"
diff runtime_compiled.hex onchain_runtime.hex && echo "EXACT MATCH"
```

## What this contract does

HashDB (KARMA) is a 2017 ERC-20-like token backing HashDB, an Ethereum-based data storage and hashing service. The token mints on `buy()` (msg.value/buyPrice tokens, refunds overpayment via `owner.call`), burns on `sell()` (msg.sender.call with amount*sellPrice), and has owner-controlled `setPrices()` with the guard that `newSellPrice` cannot exceed `sellPrice` when `totalSupply` is non-zero (preventing dilution at unfavorable rates for existing holders). Notable design: `transferFrom()` bypasses the allowance check when caller is the registered `frontend` or the contract owner, letting the off-chain HashDB UI move user balances without explicit per-transfer approvals. The frontend address is set via `setFrontend()` owner-only.
