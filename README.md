# Awesome Ethereum Proofs [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Source code verification proofs for the earliest contracts on Ethereum (2015-2017), created through compiler archaeology and bytecode matching.

Each proof independently compiles the original source code with the exact compiler version used at deployment time, producing a byte-for-byte match against on-chain bytecode. These are contracts too old for Etherscan's automated verification tools.

Part of [Ethereum History](https://ethereumhistory.com/proofs).

## Proofs

| Contract | Deployed | Compiler | Method | Proof |
|---|---|---|---|---|
| [First Executable Contract](https://ethereumhistory.com/contract/0x6516298e1c94769432ef6d5f450579094e8c21fa) | Aug 7, 2015 (block 48,643) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/first-executable-contract-verification) |
| [Greeter (Hello World!)](https://ethereumhistory.com/contract/0xfea8c4afb88575cd89a2d7149ab366e7328b08eb) | Aug 7, 2015 (block 48,681) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/greeter-verification) |
| [PrimeChecker](https://ethereumhistory.com/contract/0x66D796E7AE8608BbA361c97bA7682689cc5Bf320) | Aug 7, 2015 (block 48,790) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/primechecker-verification) |
| [Greeter (0xcde4)](https://ethereumhistory.com/contract/0xcde4de4d3baa9f2cb0253de1b86271152fbf7864) | Aug 7, 2015 (block 49,392) | soljson v0.1.1 | Exact bytecode match (creation TX) | [Repo](https://github.com/cartoonitunes/greeter-0xcde4-verification) |
| [PrimeChecker (instance 2)](https://ethereumhistory.com/contract/0xdae5047277a2cc3d0013fc0cf4a12817b9b85c33) | Aug 7, 2015 (block 49,416) | soljson v0.1.1 | Exact bytecode match (identical to 0x66d796e7) | [Repo](https://github.com/cartoonitunes/primechecker-verification) |
| [PrimeChecker (instance 3)](https://ethereumhistory.com/contract/0x7b2d5c63d3671092d3d44671717ea78018164661) | Aug 7, 2015 (block 49,618) | soljson v0.1.1 | Exact bytecode match (identical to 0x66d796e7) | [Repo](https://github.com/cartoonitunes/primechecker-verification) |
| [Coin (0xd958)](https://ethereumhistory.com/contract/0xd958b51bc95338d152d55beed17a156e8aec4c9f) | Aug 7, 2015 (block 49,888) | soljson v0.1.1 (optimizer OFF) | Exact bytecode match | [Proof](proofs/coin-d958/) |
| [MyScheme (1ETH)](https://ethereumhistory.com/contract/0x109c4f2ccc82c4d77bde15f306707320294aea3f) | Aug 7, 2015 (block 49,924) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/chainletter-verification) |
| [EarlyChainLetter10ETH](https://ethereumhistory.com/contract/0xa327075af2a223a1c83a36ada1126afe7430f955) | Aug 7, 2015 (block 49,931) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/chainletter-verification) |
| [EarlyChainLetterSmall](https://ethereumhistory.com/contract/0xbaa54d6e90c3f4d7ebec11bd180134c7ed8ebb52) | Aug 7, 2015 (block 49,936) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/chainlettersmall-verification) |
| [GlobalRegistrar (rank 19)](https://ethereumhistory.com/contract/0x1392a4f1642c22bc6e3380bb156193e790770c35) | Aug 13, 2015 (block 50,466) | go-ethereum built-in (commit 83ee3944) | Author-published source+bytecode match | [Repo](https://github.com/cartoonitunes/globalregistrar-verification) |
| [MovieVoting (earlier)](https://ethereumhistory.com/contract/0x58828dc80663a0f3d4ba2dcaff1c4fdffb88d96a) | Aug 7, 2015 (block 51,112) | soljson v0.1.1 (optimizer ON) | Identical bytecode to rank 23 | [Proof](https://github.com/cartoonitunes/awesome-ethereum-proofs/tree/main/proofs/movie-voting-0x8bbf81e9/) |
| [MovieVoting](https://ethereumhistory.com/contract/0x8bbf81e9a8e936242354047c9905d621e269c7f7) | Aug 7, 2015 (block 51,128) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Proof](https://github.com/cartoonitunes/awesome-ethereum-proofs/tree/main/proofs/movie-voting-0x8bbf81e9/) |
| [GlobalRegistrar (rank 24)](https://ethereumhistory.com/contract/0xf436ceba3850bd3b0e853b018212d6fc2b6267d0) | Aug 22, 2015 (block 51,245) | go-ethereum built-in (commit 83ee3944) | Identical bytecode to rank 19 | [Repo](https://github.com/cartoonitunes/globalregistrar-verification) |
| [SciFi Token](https://www.ethereumhistory.com/contract/0xd94badbec21695b7a36abcb979efad0108319d18) | Aug 8, 2015 (block 51,291) | soljson v0.1.4 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/scifi-verify) |
| [LotteryPrototype v1](https://ethereumhistory.com/contract/0x7573aca378b8417623cad233954fde810cad9fb4) | Aug 8, 2015 (block 55,701) | soljson v0.1.5 (optimizer ON) | Source identified, size match, optimizer layout differs | — |
| [LotteryPrototype v2](https://ethereumhistory.com/contract/0xf6bf0ee51fe0ee92500bb22295382e9241ec3b5c) | Aug 8, 2015 (block 57,060) | soljson v0.1.5 (optimizer ON) | Source identified, size match, optimizer layout differs | — |
| [HashReg](https://www.ethereumhistory.com/contract/0x23bf622b5a65f6060d855fca401133ded3520620) | Aug 7, 2015 (block 282,885) | Pre-release Solidity (source from go-ethereum v1.0.0) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/hashreg-verify) |
| [NameRegistry](https://ethereumhistory.com/contract/0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00) | Aug 8, 2015 (block 52,426) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/namereg-verification) |
| [MessageStore](https://ethereumhistory.com/contract/0xd2eccde805e888ae37646544d60185b842ff3d6b) | Aug 8, 2015 (block 53,573) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/messagestore-verification) |
| [EF Multisig Wallet](https://ethereumhistory.com/contract/0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae) | Aug 8, 2015 (block 54,092) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ef-wallet-verify) |
| [Coin (stub)](https://ethereumhistory.com/contract/0x4fb5acbe16ffdda225cb14c64aa84c7e253b08ae) | Aug 8, 2015 (block 54,126) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/coin-stub-verification) |
| [First Messaging Contract](https://ethereumhistory.com/contract/0x3a2c6e618b72f2047f5be10570582d41840b8e78) | Aug 8, 2015 (block 54,969) | solc v0.1.1 (native C++) | Exact bytecode match (creation TX) | [Repo](https://github.com/cartoonitunes/first-messaging-contract-verification) |
| [Etherparty](https://ethereumhistory.com/contract/0x8200b7230d552862942875355f71fe4617e814d6) | Aug 8, 2015 (block 55,345) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/etherparty-verification) |
| [SimpleStorage x4](https://ethereumhistory.com/contract/0xaec076c43acc2e0db807ee4d63bd8d48a24643e4) | Aug 8, 2015 (block 55,399) | solc v0.1.1 (native C++) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/simplestorage-verification) |
| [Forwarder](https://ethereumhistory.com/contract/0x44bc652e977c0a40905ea9d0eb0da1a148358d61) | Aug 8, 2015 (block 56,406) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/forwarder-verification) |
| [EarlyChainLetter100ETH](https://ethereumhistory.com/contract/0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64) | Aug 9, 2015 (block 60,143) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/chainletter100eth-verification) |
| [Multiply7](https://ethereumhistory.com/contract/0xa18d7182d5935578958a07fd7e9d062ddd418761) | Aug 9, 2015 (block 66,173) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/multiply7-verification) |
| [FunDistributor](https://ethereumhistory.com/contract/0x125b606c67e8066da65069652b656c19717745fa) | Aug 10, 2015 (block 62,632) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/fundistributor-verification) |
| [Multiply7](https://ethereumhistory.com/contract/0xfcb20ae9a3fa95af55803b8cdab4b0643fb96d3f) | Aug 10, 2015 (block 63,886) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/multiply7-verification) |
| [EF Sub-Multisig](https://ethereumhistory.com/contract/0x209711382eaeb6c1e021e0fc81acc5afa9b23d25) | Aug 7, 2015 (block 72,142) | Serpent (ethereum/serpent) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ef-multisig-verification) |
| [HonestDice](https://ethereumhistory.com/contract/0xc4c51de1abf5d60dbd329ec0f999fd8f021ae9fc) | Aug 12, 2015 (block 74,817) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/honestdice-verification) |
| [HonestDice (1 ETH)](https://ethereumhistory.com/contract/0xd79b4c6791784184e2755b2fc1659eaab0f80456) | Aug 12, 2015 (block 75,008) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/honestdice1eth-verification) |
| [Augur REP Crowdsale](https://ethereumhistory.com/contract/0xe28e72fcf78647adce1f1252f240bbfaebd63bcc) | Aug 15, 2015 (block 88,090) | Serpent (ethereum/serpent) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/augur-crowdsale-verify) |
| [Ethereum Multisig Wallet (EF Signer)](https://ethereumhistory.com/contract/0xfe8ad7dd2f564a877cc23feea6c0a9cc2e783715) | Aug 20, 2015 (block 115,693) | soljson v0.1.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/fe8a-wallet-verify) |
| [EthereumPyramid](https://ethereumhistory.com/contract/0x7011f3edc7fa43c81440f9f43a6458174113b162) | Sep 7, 2015 (block 198,362) | soljson v0.1.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ethereum-pyramid-verification) |
| [Gamble](https://ethereumhistory.com/contract/0xaf5558b1b834be59b9ff94e05c17bae9257c9bf1) | Sep 15, 2015 (block 235,543) | Serpent fd9b0b6 (2015-09-06) | Exact bytecode match (creation TX) | [Repo](https://github.com/cartoonitunes/gamble-verification) |
| [EF1 ABI Test (foo())](https://ethereumhistory.com/contract/0xe30608b59313681a1deaf5bea46f1cdb5052f474) | Sep 20, 2015 (block 261,486) | solc 0.5.17 (Yul strict-assembly) | Exact runtime bytecode match | [Repo](https://github.com/cartoonitunes/ef1-foo-verification) |
| [EF1 ABI Test (foo() v2)](https://ethereumhistory.com/contract/0xdf8eb001f29302ee380c548044dce4a09bd9e48d) | Sep 20, 2015 (block 261,486) | solc 0.5.17 (Yul strict-assembly) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ef1-foo2-verification) |
| [EF1 ABI Test (bar(uint256))](https://ethereumhistory.com/contract/0x441e72c65163612caf1b1c9ffaf67596defee0f9) | Sep 20, 2015 (block 261,486) | soljson v0.1.4 (no optimizer) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/ef1-bar-verification) |
| [Frontier Coin](https://ethereumhistory.com/contract/0xFF2947b1851bB16a7C8E71C6a8458D29600F9D6a) | Sep 21, 2015 (block 271,040) | soljson v0.1.1 (emscripten) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/frontier-coin-verification) |
| [radcoin](https://ethereumhistory.com/contract/0x522a493d563b0189c76877382b33f4c8c842922c) | Sep 22, 2015 (block 274,203) | soljson v0.1.1 (emscripten) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/frontier-coin-verification) |
| [Mist D.A.O.](https://ethereumhistory.com/contract/0x8d554c6c1631e44706e502433f0f958287d9b8dc) | Dec 3, 2015 (block 635,909) | soljson v0.1.5 (optimizer ON) | Source identified, 9/9 selectors match, exact size match, optimizer layout differs | [Repo](https://github.com/cartoonitunes/mistcoin-dao-verification) |
| [Coin](https://ethereumhistory.com/contract/0x853965810caae77e576015580b9cebbe886db5c6) | Dec 13, 2015 (block 683,669) | Native C++ solc (webthree-umbrella v1.1.2) | Exact bytecode match | [Proof](proofs/coin-0x853965/) |
| [Blockchain Congress](https://ethereumhistory.com/contract/0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb) | Dec 28, 2015 (block 762,866) | soljson v0.1.6 (optimizer ON) | Exact bytecode match (creation TX + constructor args) | [Repo](https://github.com/cartoonitunes/congress-verification) |
| [TheLuckyOne](https://ethereumhistory.com/contract/0x2adfc2febf51d75d195ccd903251c099fdd22f20) | Oct 1, 2015 (block 310,456) | soljson v0.1.3 (no optimizer) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/theluckyone-verify) |
| [Logger](https://ethereumhistory.com/contract/0x7b6556b40a5a4d40118387495314f4445986239c) | Oct 1, 2015 (block 319,519) | soljson v0.1.2 (no optimizer) | Exact bytecode match | [Proof](proofs/logger-verification/) |
| [Fabian Token](https://ethereumhistory.com/contract/0xe274d18ef7b194a1edebb04cfe297cfe1489ef65) | Oct 26, 2015 (block 443,423) | soljson v0.1.5 (no optimizer) | Source reconstructed | [Repo](https://github.com/cartoonitunes/fabian-token-verification) |
| [MistCoin](https://ethereumhistory.com/contract/0xf4eced2f682ce333f96f2d8966c613ded8fc95dd) | Nov 3, 2015 (block 483,325) | Solidity (author-published) | Author-published source | [Source](https://github.com/crypt0biwan/mistcoin) |
| [Coin (Tutorial)](https://ethereumhistory.com/contract/0xbdc57bee2fb6d0092ad5437925ad762fec68a548) | Nov 4, 2015 (block 490,501) | Native C++ solc v0.1.6 (optimizer ON) | Exact bytecode match | [Proof](https://github.com/cartoonitunes/awesome-ethereum-proofs/tree/main/proofs/coin-0xbdc57bee/) |
| [Coin (Tutorial)](https://ethereumhistory.com/contract/0x283f1161c2d4ff33fd5d5d4486fc0675732cea11) | Nov 4, 2015 (block 490,523) | Native C++ solc v0.1.6 (optimizer ON) | Exact bytecode match | [Proof](https://github.com/cartoonitunes/awesome-ethereum-proofs/tree/main/proofs/coin-0x283f1161/) |
| [Vitalik's Currency Token](https://ethereumhistory.com/contract/0xa2e3680acaf5d2298697bdc016cf75a929385463) | Nov 12, 2015 (block 531,071) | Serpent @ f0b4128 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/vitalik-currency-verification) |
| [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945) | Nov 13, 2015 (block 536,195) | soljson v0.1.5-v0.1.7 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/etherboard-verification) |
| [Greeter x111](https://ethereumhistory.com/contract/0xaa159b9af634c040e1853fee9dcff12bd6f58772) | Nov 20, 2015 | solc v0.2.1 (native C++, optimizer ON) | Exact bytecode match (111 siblings) | [Repo](https://github.com/cartoonitunes/greeter-111-verification) |
| [Classic Coin](https://ethereumhistory.com/contract/0x7B484f9272C9b17e28A5D87d63820F31Be92B6E7) | Jan 10, 2016 (block 826,605) | solc v0.2.0 (native C++, optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/classic-coin-verification) |
| [Doubler](https://ethereumhistory.com/contract/0x2ff2a65b0a324c04747bfdc63f4bf525d43e5c62) | Jan 21, 2016 (block 883,117) | solc v0.2.0 (native C++) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/doubler-verify) |
| [YoutubeViews](https://ethereumhistory.com/contract/0xcd88e9f1dfa89b3bda09d6703c5a0b800a34f61d) | Jan 25, 2016 (block 904,395) | soljson v0.2.0 nightly (Jan 2016, optimizer ON) | Source reconstructed | [Repo](https://github.com/cartoonitunes/youtubeviews-verification) |
| [King of the Ether Throne v0.3.0](https://ethereumhistory.com/contract/0xa9d160e32ad37ac6f2b8231e4efe14d35abb576e) | Jan 23, 2016 (block 893,433) | soljson v0.2.0 nightly 2016.1.20, optimizer OFF | Author-published source | [Repo](https://github.com/cartoonitunes/koth-verification) |
| [Coin (Solidity Tutorial) x83](https://ethereumhistory.com/contract/0x678a889fca4033328cc90bb71cb5d3783c0d86e6) | Sep 26, 2015 | solc v0.2.1 (native C++, optimizer ON) | Exact bytecode match (83 siblings) | [Repo](https://github.com/cartoonitunes/basic-token-verification) |
| [Token 0.1 (fixed transferFrom) x103](https://ethereumhistory.com/contract/0xb7eec0605dfeef01bd4ab7251db52d4963c5e31e) | May 20, 2016 | solc v0.2.1 (native C++, optimizer ON) | Exact bytecode match (103 siblings) | [Repo](https://github.com/cartoonitunes/basic-token-verification) |
| [Basic Token (unoptimized) x138](https://ethereumhistory.com/contract/0xcc2ee7b5eee0d247afed2319202d51907be0bd4e) | Jan 16, 2016 | solc v0.2.1 (native C++, optimizer OFF) | Exact bytecode match (138 siblings) | [Repo](https://github.com/cartoonitunes/basic-token-verification) |
| [Basic Token (optimized) x200](https://ethereumhistory.com/contract/0x5d3ffbb1de19d1e577626d70d0b82fd7b1af6d47) | Feb 1, 2016 | solc v0.2.1 (native C++, optimizer ON) | Exact bytecode match (200 siblings) | [Repo](https://github.com/cartoonitunes/basic-token-verification) |
| [Doubler (0xc182)](https://ethereumhistory.com/contract/0xc1824278b767d9efb304c63128b1a92babc3fa4b) | Feb 19, 2016 (block 1,028,387) | soljson v0.2.1 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/doubler-0xc182-verification) |
| [DynamicPyramid](https://ethereumhistory.com/contract/0xa9e4e3b1da2462752aea980698c335e70e9ab26c) | Feb 23, 2016 (block 1,049,304) | solc v0.2.0 (native C++, optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/dynamic-pyramid-verification) |
| [DinastyCoinToken](https://ethereumhistory.com/contract/0x3693fd44b16dc9316ed69a029985b3170dc11466) | Mar 14, 2016 (block 1,148,743) | solc v0.2.0 (native C++, optimizer ON) | Exact bytecode match | [Proof](proofs/dinastycointoken/) |
| [Poker Chips (POKER)](https://ethereumhistory.com/contract/0x002a13B63cF696c58c95EacBA48a62c812164639) | Mar 21, 2016 (block 1,192,284) | solc v0.2.1 (native C++, optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/pokerchips-verification) |
| [MeatConversionCalculator](https://ethereumhistory.com/contract/0x4ab274fc3a81b300a0016b3805d9b94c81fa54d2) | Mar 24, 2016 (block 1,211,128) | Solidity (author-published) | Author-published source | [Gist](https://gist.github.com/alexvandesande/3abc9f741471e08a6356) |
| [Grinder Association](https://ethereumhistory.com/contract/0xc7e9ddd5358e08417b1c88ed6f1a73149beeaa32) | Mar 24, 2016 (block 1,211,176) | Solidity (author-published) | Author-published source | [Gist](https://gist.github.com/alexvandesande/3abc9f741471e08a6356) |
| [GavCoin](https://ethereumhistory.com/contract/0xb4abc1bfc403a7b82c777420c81269858a4b8aa4) | Apr 26, 2016 (block 1,408,600) | solc v0.3.1 | Exact bytecode match | [Repo](https://github.com/cartoonitunes/gavcoin-verify) |
| [Mist Multisig Wallet (4088b, optimized)](https://ethereumhistory.com/contract/0x1fad12be55386d48388367513f1f04cbef77949c) | May 16, 2016 (block 1,528,964) | solc v0.3.0 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/wallet-4088-verification) |
| [Mining Coin](https://ethereumhistory.com/contract/0xA5192CD81bD050B7eeBa24B9DE3C5dd983968A27) | Jun 16, 2016 (block 1,718,272) | soljson v0.3.3 (emscripten) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/mining-coin-verification) |
| [ShapeShift Chain-Split Forwarder](https://ethereumhistory.com/contract/0xa2d5c5eb9bffe1f8380e27cf54311747b7d549de) | Jul 24, 2016 (block 1,951,734) | solc v0.2.1–v0.3.5 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/shapeshift-chainsplit-verification) |
| [ShapeShift Chain-Split Receiver](https://ethereumhistory.com/contract/0x3e7756b1ea48f2caf35d820b5e46cbbec62e7a25) | Jul 26, 2016 (block 1,957,038) | solc v0.2.1–v0.3.5 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/shapeshift-chainsplit-verification) |
| [ShapeShift Chain-Split Receiver](https://ethereumhistory.com/contract/0x89afcc1452d4ffbf720bdd2da354fc0691a51456) | Jul 26, 2016 (block 1,957,039) | solc v0.2.1–v0.3.5 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/shapeshift-chainsplit-verification) |
| [ShapeShift Chain-Split Splitter](https://ethereumhistory.com/contract/0xfdc6a6ad6711ca98c1cb269312c93d601ee2dbbf) | Jul 26, 2016 (block 1,957,123) | solc v0.2.1–v0.3.5 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/shapeshift-chainsplit-verification) |
| [HugCoin](https://ethereumhistory.com/contract/0xb83cab8babc0b9298df5d5283c30bf0d89d23b1e) | Aug 23, 2016 (block 2,123,297) | soljson v0.3.5 (optimizer ON) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/hugcoin-verification) |
| [Exchange Deposit Forwarder v1](https://ethereumhistory.com/contract/0x895e7e8f082267c1c704f97f89e0160d767083a8) | Oct 4, 2016 (block 2,375,846) | solc v0.4.2 (optimizer OFF) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/forwarder-verification) |
| [Token Forwarder](https://ethereumhistory.com/contract/0x0001baa5df07a6ccbf56f65d00b58fbcabc8eb5a) | Oct 2016 (block 2,914,655) | solc v0.4.2 (optimizer ON) | Near-exact bytecode match | [Repo](https://github.com/cartoonitunes/forwarder-token-verification) |
| [Token Sweeper](https://ethereumhistory.com/contract/0x9a96270a85fb79eb320f2f7965ccf5c19ba695c7) | Feb 18, 2017 (block 3,203,394) | solc v0.4.9 (no optimizer) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/sweeper-verification) |
| [UserWallet (Collector)](https://ethereumhistory.com/contract/0x0001414bb1355d97087a550f95e8e22782106902) | Jun 2017 (block 3,806,458) | solc v0.4.11 (optimizer ON) | Near-exact bytecode match | [Repo](https://github.com/cartoonitunes/userwallet-verification) |
| [Curio Cards v2 (Cards 17-19)](https://ethereumhistory.com/contract/0x8ccf904e75bc592df3db236cd171d0caf0b2bbcb) | Jun 20, 2017 (block 3,902,090) | solc v0.4.8 (optimizer OFF) | Exact bytecode match | [Repo](https://github.com/cartoonitunes/curio-cards-verify) |
| [Peperium Series 2 Token](https://ethereumhistory.com/contract/0x5921f43985a027ba74ee110b77dce09b96de943e) | Aug 2017 (block 4,210,431) | solc v0.4.14 (optimizer OFF) | Near-exact bytecode match | [Repo](https://github.com/cartoonitunes/peperium-series2-verification) |
| [CryptoCats Pre-Launch Test (T1)](https://ethereumhistory.com/contract/0xD23AdE68C693264Aa9e8f8303F912A3E54718456) | Nov 11, 2017 (block 4,530,388) | Solidity 0.4.18 (optimizer ON) | Near-exact bytecode match | [Repo](https://github.com/cartoonitunes/cryptocats-t1-verification) |
| [CryptoCats Pre-Launch Test (T2)](https://ethereumhistory.com/contract/0x78eea094e1d30141ccade64f8d29a7bfcc921f9e) | Nov 11, 2017 (block 4,532,036) | Solidity 0.4.18 (optimizer OFF) | Near-exact bytecode match (8137/8451, 96.3%) | [Repo](https://github.com/cartoonitunes/cryptocats-t2-verification) |
| [Unicorns Token (0x1f75 / 0x59a2)](https://ethereumhistory.com/contract/0x1f75047233517dcf67970d9e3c3bb385cb647f30) | Feb 11, 2016 (block 987,979) | solc v0.1.1 native C++ (optimizer ON) | Source reconstructed - exact block multiset match | [Proof](proofs/unicorns-token/) |
| [Unicorns Token (0x41a7)](https://ethereumhistory.com/contract/0x41a7820c86f4bea29e6c9239aeb0fbdba12dd790) | Feb 11, 2016 (block 988,807) | solc v0.1.1 native C++ (optimizer ON) | Source reconstructed - exact block multiset match | [Proof](proofs/unicorns-token/) |
| [Unicorns Token (0xe369 / 0xab15)](https://ethereumhistory.com/contract/0xe36905580fa8cc3006c14bafab9d0ecf39c9c124) | Feb 11, 2016 (block 988,921) | solc ~v0.1.2 (Mist snapshot, optimizer ON) | Source reconstructed | [Proof](proofs/unicorns-avsa-1802b/) |

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


## Tools

- **[Native C++ Solidity Compilers](https://github.com/cartoonitunes/solc-native-builds)** — Pre-built solc binaries for frontier-era bytecode archaeology. Required when soljson/npm builds produce close-but-not-exact matches.
