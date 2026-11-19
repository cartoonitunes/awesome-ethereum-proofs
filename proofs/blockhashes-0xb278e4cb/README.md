# Ethereum Blockhashes (0x84cb2fd6, 0xb278e4cb): Bytecode Proof

| Field | Value |
|-------|-------|
| Addresses | `0x84cb2Fd6f7b123acC0762bA4A8E1E3987cBA125D` (Sep 3, 2015), `0xB278E4cB20dfbf97e78f27001F6B15288302F4d7` (Sep 4, 2015) |
| Deployer | `0x8266C4A0…` (both) |
| Language | Serpent |
| Compiler | ethereum/serpent `f67c1a9` (2015-09-04). Also exact with `6faaebb`, `a7716d3` and `fd9b0b6` |
| Match | exact runtime and exact creation code, both addresses |

Andrew Miller's blockhash oracle keeps the block-number → blockhash mapping beyond the 256-block window of `block.blockhash`. `add_recent(n)` stores a recent hash. `add_old(header, n)` proves an older one by hashing the child block header. This was a workaround for Etherpot, whose lottery had been broken by the 256-block limit.

- `0x84cb2fd6` = `blockhashes.se` at amiller/ethereum-blockhashes `ac069aa` ("Initial", Sep 2, 2015). Commits `ad50a00` and `f93a8a2` compile to the same bytecode.
- `0xb278e4cb` = the live instance the repo README links to: "Thanks to Kobi Gurk, an instance of this contract is now live", with a pointer to kobigurk/ethereum-blockhashes `c4b5f33`. That version adds `get_blockhash_from_storage(n)`.

Sources are unmodified. Etherscan cannot verify Serpent.

## Verify

```
# docker image serpent-compiler, /serpent at f67c1a9: make && ./serpent compile <file>.se
# runtime = creation[14 : 14+LEN], LEN from the 61<LEN>80 preamble
```
