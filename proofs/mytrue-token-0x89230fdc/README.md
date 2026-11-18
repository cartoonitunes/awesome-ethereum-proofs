# MyToken with a misnamed constructor (`0x89230fdc`)

- **Address:** `0x89230fdc3b73851da77ebec3cc9f340e48ac0df1`
- **Deployed:** 2015-12-10, by `0x1d01dae64a1e92c2b09c248be5e185c16ff79093`
- **Compiler:** soljson v0.2.0+commit.4dc2445e, optimizer off
- **Match:** runtime and creation code byte-identical

A December 2015 copy of the ethereum.org `MyToken` tutorial. The initializer is named `MyTrue` instead of the contract name, so Solidity treated it as an ordinary public function rather than a constructor. The deployment therefore ran no initializer: name, symbol and decimals stayed empty, and anyone could call `MyTrue(...)` later to set them and credit themselves a balance.

Someone did call it afterwards: onchain the token reads `name = "zachcoin"`, `symbol = "z"`, `decimals = 0`.

`MyTrue` was recovered from selector `0x95f18951` by brute force. The contract name does not appear in the bytecode; `MyToken` is the tutorial's name.

Run `./verify.sh` with `SOLJSON` and `ONE` (see `_solc/one.js` in eth-bytecode-cracker) set to reproduce.
