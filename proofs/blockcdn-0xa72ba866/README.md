# BlockCDN (BCDN) token, ICO deployment (November 2016)

- **Address:** `0xa72ba8665992f2d48851bca8889e320f67b12557`
- **Deployer:** `0x8ad39e9e6cb8e87b077c556be897986c807eea0c`
- **Deployment tx:** `0x9fdf684875905fe7567f4b0e8f9609d17d01bd65ea01d80afd2414b424a336be`
- **Block:** 2,546,563 (2016-11-01 10:54:42 UTC)
- **Runtime size:** 2,595 bytes
- **Runtime SHA-256:** `a7ca7ac0d173cf1e32fc4448dcc1407978ead632c2978c97494e742518536018`
- **Balance (June 2026):** 0 ETH
- **Crack status: CRACKED (full match).** Compiled source matches both the on-chain **runtime** (2,595 bytes) and the on-chain **creation** bytecode (the 3,105-byte init+runtime, followed by 416 bytes of ABI-encoded constructor args, reproduces the 3,521-byte deployment input exactly).
- **Verified on:** Sourcify (full match, runtime + creation) and Etherscan.

## Constructor

`blockcdn(address _owner, string _tokenName, uint8 _decimalUnits, string _tokenSymbol, uint256 _totalSupply, uint256 _closeTime, uint256 _startTime, uint256 _minValue, uint256 _maxValue)`. Deployed args: owner `0x8ad39e9e…eea0c`, name/symbol `BCDN`, decimals 15, totalSupply 1e24, closeTime 1478318400, startTime 1477972800, minValue 1.5e23, maxValue 4e23.

Note: the constructor accepts `_startTime` as a parameter but does **not** store it (`startTime` is only set later via `modifyStartTime`). Storing it would add one `SSTORE` to the init code and break the creation match; omitting it is what makes the creation bytecode byte-exact.

## Identification

This is a BlockCDN (BCDN) token-sale contract from 1 November 2016. BlockCDN was a decentralized CDN / bandwidth-sharing project; the contract is an ERC20-style token combined with an ICO fund/refund mechanism (`buyBlockCDN`, `reFund`, `reFundByOther`, `sendRewardBlockCDN`, fund window via `startTime` / `closeTime`, and `minFundedValue` / `maxFundedValue` caps).

The project's own source is in the GitHub repo `Blockcdnteam/BCDNICO` (`blockcdn.sol`), and a sibling deployment is verified on Etherscan:

- `0x1e797ce986c3cff4472f7d38d5c4aba55dfefe40` verified as `blockcdn`, compiler `v0.4.2+commit.af6afb04`, optimizer ON runs 200 (the team's "version 1.3").

The verified v1.3 source does **not** match this 1 November deployment byte-for-byte. The on-chain contract here is an intermediate, never-pushed revision that sits between the repo's 24 August commit and the 9 November "version 1.3" commit. I reconstructed it from the verified v1.3 source, driven by the on-chain bytecode. The storage layout is identical to v1.3 (slots: `balances`, `fundValue`, `owner`, `name`, `symbol`, `decimals`, `totalSupply`, `minFundedValue`, `maxFundedValue`, `isFundedMax` + `isFundedMini` packed in slot 9, `closeTime`, `startTime`), which anchored the whole reconstruction.

## Crack: exact bytecode match

Compiling `blockcdn.sol` in this directory with `soljson-v0.4.2+commit.af6afb04` (optimizer ON, runs 200) produces a runtime whose SHA-256 equals the on-chain SHA-256:

```
a7ca7ac0d173cf1e32fc4448dcc1407978ead632c2978c97494e742518536018
```

Run `node verify.js` to reproduce (requires the `solc` npm wrapper for the compiler interface).

## Source deltas: verified v1.3 to this 1 November deployment

The on-chain bytecode demanded five precise differences from the verified v1.3 source:

1. **No `payable`.** v1.3 marks seven functions `payable`. This deployment rejects value on every dispatched function and on the fallback (each carries the `CALLVALUE PUSH2 0x0002 JUMPI` value-reject guard).
2. **`buyBlockCDN` emits `Transfer(this, msg.sender, token)`**, using `address(this)` as the from-address (matching the older August version), not v1.3's `Transfer(owner, msg.sender, token)`. This single change raised the leading match from 292 to 882 bytes.
3. **`reFund` / `reFundByOther` drop their two leading guards** (`if (now <= closeTime) throw;` and the `isFundedMini` guard) and go straight to the `fundValue` read.
4. **`sendRewardBlockCDN` drops its `closeTime` and `isFundedMini` guards** (it keeps the owner check and the balance check).
5. **`transfer` is restructured** so all paths share one trailing `Transfer(msg.sender, _to, _value); return true;`: `if (now < closeTime) { if (_to == this) { ...fund-path send-or-return-false... } } else { ...normal balance moves... }` followed by the single shared emit/return. This is what makes the compiler emit the one merged Transfer/return tail the target has, and it was the final change that flipped the result to an exact match.
