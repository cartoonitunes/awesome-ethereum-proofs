# Coin Tutorial Contract Verification

Bytecode verification proof for the Coin tutorial contract.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x283f1161c2d4ff33fd5d5d4486fc0675732cea11` |
| Deployed | Nov 4, 2015 (block 490,523) |
| Compiler | Native C++ solc v0.1.6 (webthree-umbrella tag 1.0.1, commit d41f8b7c) |
| Optimizer | ON |
| Runtime | 238 bytes |
| Creation | 314 bytes (+ 32 bytes constructor args) |
| Runtime SHA-256 | `d5e50388e265aed4077eca4aefa4d6ebc0837559da4a88701c2e13558e325f56` |
| Creation SHA-256 | `a5f9df7c36c1ba7ca64007642473cb067ae6ea6dd7d3215ea0c4ae35ed2312e4` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Sibling

`0xbdc57bee2fb6d0092ad5437925ad762fec68a548` (block 490,501) has identical runtime bytecode, deployed by the same address 22 blocks earlier.

## Verification

Requires Docker and a native C++ solc build from webthree-umbrella:

```bash
# 1. Clone webthree-umbrella at tag 1.0.1
git clone --recursive --branch 1.0.1 --depth 1 https://github.com/ethereum/webthree-umbrella.git

# 2. Build the compiler (see https://github.com/gpersoon/solc-native-builds-x86 for Dockerfile)
docker build --platform linux/amd64 -f Dockerfile.static -t solc-v016 .

# 3. Compile and compare
docker run --rm --platform linux/amd64 \
  -v $(pwd)/Coin.sol:/src.sol \
  solc-v016 \
  bash -c '/src/build/solidity/solc/solc --optimize --bin /src.sol'
```

The script `verify.js` compares the compiled output against the on-chain runtime bytecode.

```bash
node verify.js
```

## Source

```solidity
contract Coin {
    mapping(address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);
    function Coin(uint supply) {
        if (supply == 0) supply = 1000;
        coinBalanceOf[msg.sender] = supply;
    }
    function sendCoin(address receiver, uint amount) returns (bool sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return false;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return true;
    }
}
```
