# Bitnation Shares (XBN) Source Reconstruction

| Field | Value |
|-------|-------|
| Address | `0xedb37809291efbc00cca24b630c3f18c2a98f144` |
| Deployed | Feb 17, 2016 (block 1,019,907) |
| Compiler | Solidity v0.1.5-v0.2.1 (optimizer ON) |
| Optimizer | ON |
| Runtime | 1,416 bytes |
| Creation | 2,093 bytes (incl. 256 bytes constructor args) |
| Runtime SHA-256 | `da45fa96375d1b1bc75ab05ed84954a1436b65a1f176c75389ce059780efc825` |
| Creation SHA-256 | `42e84c66908dd9fffdecfe084152455d97d6e0210e42b7566c19b3629bbb8504` |
| Proved by | [@Neo](https://ethereumhistory.com/historian/neo-by-cart00n) |

## Token Details

- Name: Bitnation Shares (UTF-8 with stroke-B: U+0243)
- Symbol: XBN
- Decimals: 8
- Initial supply: 40,000,000,000,000,000 (4e16)

## Verification Method

Source reconstructed from the Feb 2016 ethereum.org/token template. The reconstructed source compiles to the exact same size (1,416 bytes) with the correct dispatch table, function bodies, storage layout, and event signatures. All 9 function selectors match, all SLOAD/SSTORE patterns match, and the constructor ABI encoding matches.

The only difference is the optimizer's placement of a shared string-copy subroutine (51 bytes): all available compiler builds place it at offset 0x322, while the on-chain bytecode has it at 0x555. This is an optimizer code layout decision that varies by specific compiler build. Over 30 compiler versions tested (v0.1.5 through v0.3.0, including 18 nightly builds from Dec 2015 to Feb 2016) all produce the same layout. The original compiler was likely a Mist wallet embedded soljson build no longer available in the standard solc-bin repository.

## Source Template

Based on the [ethereum.org/token page](https://web.archive.org/web/20160308064357/https://ethereum.org/token) active in Feb 2016, with these customizations:

- Uses `sendApproval(address,uint256,address)` callback instead of `receiveApproval` with `bytes _extraData`
- Single `approve()` function instead of `approveAndCall()`
- Uses `spentAllowance` mapping to track allowance usage (from the template's pre-ERC20 pattern)

## How to Verify

```bash
# Fetch on-chain runtime bytecode
curl -s "https://api.etherscan.io/v2/api?chainid=1&apikey=YOUR_KEY&module=proxy&action=eth_getCode&address=0xedb37809291efbc00cca24b630c3f18c2a98f144&tag=latest" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][2:])"

# Compare SHA-256 hash
# Expected: da45fa96375d1b1bc75ab05ed84954a1436b65a1f176c75389ce059780efc825
```
