# Movie Voting Contract Verification

Bytecode verification proof for a Frontier Day 1 movie voting contract.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x8bbf81e9a8e936242354047c9905d621e269c7f7` |
| Deployed | Aug 7, 2015 (block 51,128) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 273 bytes |
| Creation | 292 bytes |
| Runtime SHA-256 | `db37b74b7e9533a00c19999866ed4a270a07d29353998155b79d3b91261f7919` |
| Creation SHA-256 | `727980e7b976e6d4140051d0390b270cbb05593d74dd968e0c641ee99b303bd0` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `MovieVoting.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.

## Source

```solidity
contract MovieVoting {
    mapping(bytes32 => uint) public bids;
    bytes32[] public movies;
    uint public movie_num;
    function vote(bytes32 movie) {
        if (msg.value == 0) return;
        uint b = bids[movie];
        if (b == 0) {
            movies[movie_num++] = movie;
        }
        bids[movie] += msg.value;
    }
}
```
