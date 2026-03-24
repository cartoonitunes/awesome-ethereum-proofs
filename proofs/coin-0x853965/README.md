# Coin — Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x853965810caae77e576015580b9cebbe886db5c6` |
| Deployed | Dec 13, 2015 (block 683,669) |
| Compiler | Native C++ solc (webthree-umbrella v1.1.2, Feb 2016) |
| Optimizer | OFF |
| Runtime | 508 bytes |
| Creation | 641 bytes (609 bytecode + 32 ABI-encoded constructor arg) |
| Runtime SHA-256 | `abce4a690ee974efa2a8e58da67ba605c3ca7400f9da0794440d935286902735` |
| Creation SHA-256 | `dd194fdafbdf40c450598d81fc372601e2f0a542c81587de9958ffe6e9417219` |
| Proved by | [@Neo](https://ethereumhistory.com/historian/12) |

## Contract

The classic Ethereum.org tutorial "Coin" contract — a minimal subcurrency with a coin balance mapping, a `sendCoin` transfer function, and a `CoinTransfer` event. The deployer minted **21,000,000 coins** (0x1406f40) to themselves at construction.

This is one of the earliest surviving Solidity token contracts with ETH still locked inside (7 ETH).

## Verification

The contract was compiled with the native C++ solc binary from the webthree-umbrella v1.1.2 release (February 2016), without the optimizer. The compiled output produces a byte-for-byte match of both the runtime bytecode and the creation bytecode (excluding the ABI-encoded constructor argument appended to the deployment transaction input).

### Reproduce

```bash
# Build the Docker image (solc-umbrella)
# Then:
docker run --rm solc-umbrella sh -c 'cat > /tmp/Coin.sol << SOLEOF
contract Coin {
    mapping (address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);
  
    function Coin(uint amount) {
        coinBalanceOf[msg.sender] = amount;
    }
  
    function sendCoin(address receiver, uint amount) returns(uint sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return 0;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return 1;
    }
}
SOLEOF
/umbrella/build/solidity/solc/solc --bin /tmp/Coin.sol'
```

The binary output (excluding `Binary:` header and `=== Coin ===` label) should match the on-chain creation bytecode (minus the 32-byte ABI-encoded constructor argument `0x0000000000000000000000000000000000000000000000000000000001406f40`).

## Key Details

- **Selectors:** `sendCoin(address,uint256)` = `0x90b98a11`, `coinBalanceOf(address)` = `0xbbd39ac0`
- **Event:** `CoinTransfer(address,address,uint256)` = `0x16cdf1707799c6655baac6e210f52b94b7cec08adcaf9ede7dfe8649da926146`
- **Constructor arg:** 21,000,000 tokens (0x1406f40) allocated to deployer
- **Dispatcher pattern:** Uses `7c01...9004` (PUSH29 + DIV) — pre-optimizer Solidity era
