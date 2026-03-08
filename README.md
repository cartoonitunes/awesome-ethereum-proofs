# Awesome Ethereum Proofs [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Source code verification proofs for the earliest contracts on Ethereum (2015-2017), created through compiler archaeology and bytecode matching.

Each proof independently compiles the original source code with the exact compiler version used at deployment time, producing a byte-for-byte match against on-chain bytecode. These are contracts too old for Etherscan's automated verification tools.

Part of [Ethereum History](https://ethereumhistory.com/proofs).

## Proofs

| Contract | Deployed | Compiler | Method | Proof |
|---|---|---|---|---|
| [First Executable Contract](https://ethereumhistory.com/contract/0x6516298e1c94769432ef6d5f450579094e8c21fa) | Aug 7, 2015 (block 48,643) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/first-executable-contract-verification) |
| [Greeter (Hello World!)](https://ethereumhistory.com/contract/0xfea8c4afb88575cd89a2d7149ab366e7328b08eb) | Aug 7, 2015 (block 48,681) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/greeter-verification) |
| [EarlyChainLetter10ETH](https://ethereumhistory.com/contract/0xa327075af2a223a1c83a36ada1126afe7430f955) | Aug 7, 2015 (block 49,931) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/chainletter-verification) |
| [SciFi Token](https://www.ethereumhistory.com/contract/0xd94badbec21695b7a36abcb979efad0108319d18) | Aug 8, 2015 (block 51,291) | Solidity | Exact bytecode match | [Repo](https://github.com/cartoonitunes/scifi-verify) |
| [EF Multisig Wallet](https://ethereumhistory.com/contract/0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae) | Aug 8, 2015 (block 54,092) | Solidity | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ef-wallet-verify) |
| [FunDistributor](https://ethereumhistory.com/contract/0x125b606c67e8066da65069652b656c19717745fa) | Aug 10, 2015 (block 62,632) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/fundistributor-verification) |
| [HonestDice](https://ethereumhistory.com/contract/0xc4c51de1abf5d60dbd329ec0f999fd8f021ae9fc) | Aug 12, 2015 (block 74,817) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/honestdice-verification) |
| [EthereumPyramid](https://ethereumhistory.com/contract/0x7011f3edc7fa43c81440f9f43a6458174113b162) | Sep 7, 2015 (block 198,362) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ethereum-pyramid-verification) |
| [MistCoin](https://ethereumhistory.com/contract/0xf4eced2f682ce333f96f2d8966c613ded8fc95dd) | Nov 3, 2015 (block 483,325) | Solidity | Exact bytecode match | [Source](https://github.com/crypt0biwan/mistcoin) |
| [Vitalik's Currency Token](https://ethereumhistory.com/contract/0xa2e3680acaf5d2298697bdc016cf75a929385463) | Nov 12, 2015 (block 531,071) | Serpent @ f0b4128 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/vitalik-currency-verification) |
| [Doubler](https://ethereumhistory.com/contract/0x2ff2a65b0a324c04747bfdc63f4bf525d43e5c62) | Jan 21, 2016 (block 883,117) | solc v0.2.0 (native C++) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/doubler-verification) |
| [DynamicPyramid](https://ethereumhistory.com/contract/0xa9e4e3b1da2462752aea980698c335e70e9ab26c) | Feb 23, 2016 (block 1,049,304) | solc v0.2.0 (native C++, optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/dynamic-pyramid-verification) |
| [MeatConversionCalculator](https://ethereumhistory.com/contract/0x4ab274fc3a81b300a0016b3805d9b94c81fa54d2) | Mar 24, 2016 (block 1,211,128) | Solidity | Author-published source | [Gist](https://gist.github.com/alexvandesande/3abc9f741471e08a6356) |
| [Grinder Association](https://ethereumhistory.com/contract/0xc7e9ddd5358e08417b1c88ed6f1a73149beeaa32) | Mar 24, 2016 (block 1,211,176) | Solidity | Author-published source | [Gist](https://gist.github.com/alexvandesande/3abc9f741471e08a6356) |
| [GavCoin](https://ethereumhistory.com/contract/0xb4abc1bfc403a7b82c777420c81269858a4b8aa4) | Apr 26, 2016 (block 1,408,600) | Solidity | Exact bytecode match | [Repo](https://github.com/cartoonitunes/gavcoin-verify) |

## How It Works

1. **Bytecode analysis** - Identify compiler patterns in the on-chain bytecode (constructor shape, memory allocation patterns, function selector dispatch)
2. **Source reconstruction** - Reverse-engineer or locate the original source code from GitHub repos, gists, or archive.org
3. **Compiler matching** - Try every compiler version from the deployment era until we get a byte-for-byte match
4. **Publication** - Each proof is published as an open-source repo with a reproducible verification script

## Notable Findings

- **Vitalik's Currency Token** was compiled from `currency.se` (Serpent), not `currency.sol` (Solidity). The `ethereum/dapp-bin` repo had both implementations side by side. [Vitalik confirmed on Reddit](https://reddit.com/r/ethereum/comments/1rmheom/) with "Nice find!"
- **First Executable Contract** was compiled with soljson v0.1.1, the earliest available Solidity compiler release, just 8 days after Ethereum mainnet launch.
- **FunDistributor** uses the `private` keyword for its internal `payout()` function - one of the earliest known uses of function visibility in a deployed contract. The keyword was supported in solc 0.1.1 but is rarely seen in contracts from this era. The original source was on Pastebin (expired); reconstructed entirely from on-chain bytecode.

- **Doubler contract** required building a native C++ Solidity compiler from [webthree-umbrella](https://github.com/ethereum/webthree-umbrella) v1.1.2 to reproduce the exact bytecode. The JS soljson compiler produces functionally identical but bytecode-different output for pre-0.3.x contracts. The key insight: `amount > this.balance` (GT opcode) produces different bytecode than `this.balance < amount` (LT opcode), even though they're logically equivalent.

## Why This Matters

Most contracts from 2015-2016 are unverified on Etherscan because:
- The compiler versions are too old for automated tools
- Some contracts used languages Etherscan doesn't support (Serpent, LLL)
- Source code was never published or was lost

These proofs preserve the technical history of Ethereum's earliest smart contracts.

## FunDistributor

**Contract:** [`0x125b606c67e8066da65069652b656c19717745fa`](https://etherscan.io/address/0x125b606c67e8066da65069652b656c19717745fa)
**Deployed:** August 10, 2015 (block 62,632)
**Compiler:** soljson v0.1.1+commit.6ff4cd6 (optimizer disabled)
**SHA256:** `29fef67c6a7d76329a7d3e7770a9b08ae7705553ad628b4347123be0e2fed3c5`
**Reddit:** [r/ethereum announcement](https://www.reddit.com/r/ethereum/comments/3gfxus/contract_for_exploring_behavioral_economics_and/)

An early "king of the hill" behavioral economics experiment. Send >1% of the contract's balance via `touch()` to become the receiver. If nobody touches the contract for 200+ blocks, the current receiver gets 1/3 of the balance. The interval grows by 0.5% after each payout round.

Original source was hosted on [Pastebin](http://pastebin.com/0DKLWiuc) (expired). Reconstructed from on-chain bytecode.

<details>
<summary>Verified source code</summary>

```solidity
contract FunDistributor {
    address receiver;
    uint lastBlock;
    uint touchInterval;

    function FunDistributor() {
        lastBlock = block.number;
        touchInterval = 200;
        receiver = msg.sender;
    }

    function touch() {
        payout();
        if (msg.value * 100 > this.balance) {
            receiver = msg.sender;
            lastBlock = block.number;
        } else {
            msg.sender.send(msg.value);
        }
    }

    function get_receiver() constant returns (address) {
        return receiver;
    }

    function get_target_block() constant returns (uint) {
        return lastBlock + touchInterval + 1;
    }

    function get_touch_interval() constant returns (uint) {
        return touchInterval;
    }

    function payout() private {
        if (block.number > lastBlock + touchInterval) {
            receiver.send(this.balance / 3);
            touchInterval = touchInterval + touchInterval / 200;
            lastBlock = block.number;
        }
    }
}
```

</details>

**Verification notes:**
- The Reddit post claimed payout was 25% of the balance, but verified code shows `this.balance / 3` (33.3%)
- Uses the `private` keyword for `payout()`, which was supported in solc 0.1.1 but rarely seen in deployed contracts from this era
- solc 0.1.1 evaluates binary expressions right-to-left: `msg.value * 100` and `100 * msg.value` produce different bytecode (operand push order matters for matching)

## Contributing

Found source code for an early contract? Know the compiler version for an unverified 2015 contract? Open an issue or PR.

## License

[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) - Public domain.
