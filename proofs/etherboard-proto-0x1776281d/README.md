# Etherboard prototype (0x1776281d) - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x1776281d0d40108941cb41e604dcafbdc3cd61a1` |
| Deployed | November 7, 2015 21:30 UTC (block 505,709) |
| Deployer | `0x4f5b350b662fb17ca4ec22116e91dc1417b892bc` (also deployed [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)) |
| Deploy tx | `0x3172f94cd8b4f6103f8810e87996bd2a68b3395d5a0efb7022c025fe9e8cd6b0` |
| Compiler | `soljson-v0.1.6+commit.d41f8b7c` (any v0.1.4-nightly.2015.10.2 through v0.1.7 gives identical output) |
| Optimizer | ON |
| Runtime | 2,251 bytes |
| Creation | 2,308 bytes (no constructor arguments) |
| Runtime SHA-256 | `0734e896a5db26de1e3da1fef547e0b18646ba4e877be46aecff266d2a770d7e` |
| Creation SHA-256 | `0b24c1adf6006c254bcc05c5a66fb06e205ea9ce575a629665b1d68d2dd4e526` |
| Byte match | 100% exact: runtime AND creation reproduced byte-for-byte |

## Contract

A 1000 x 1000 pixel board where anyone can buy a pixel and set its colour by sending ETH.
It's one of three prototypes the Etherboard author deployed on November 6-7, 2015, a week
before the final [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)
(block 536,195, Etherscan-verified with v0.1.7).

Third prototype. The inline `Log` + `return false` guards are factored into a public `check(bool,string,uint256)` helper, which also refunds `msg.value` to the sender when a check fails (the earlier prototypes kept the ETH). Bounds messages reworded ("X must be less than width [1000].", with the original typo "heigth"), minimum price lowered to 10 finney, and the outbid price is computed once up front. Saw about 2,750 transactions in 2015.

Shared mechanics across the prototypes:

- `setColor(x, y, color)` pays out `msg.value` minus `feePercent`% to the pixel's previous owner.
  It then overwrites the pixel with `(msg.sender, block.number, color, msg.value)`. A new bid has to be at least
  `outbidPercent`% (110) of the current price and at least `minPrice`.
- `setColorRgb(x, y, red, green, blue, alpha)` packs the colour as
  `alpha * 1048576 + red * 65536 + green * 256 + blue` and forwards to `setColor`.
- `getRow(y)` returns the owners, colours and prices of an entire row (3 x 1000 words).
- Owner-only setters for `feePercent`, `minPrice` and `outbidPercent`, and `empty()` to withdraw the balance.
- **Original bug kept:** `PixelChanged` is emitted *after* the pixel is overwritten. It reads the
  "old" owner, colour and price through a storage reference, so it actually logs the new values.

## Recovered names

Every external selector was resolved by brute force against the bytecode:
`setColor(uint256,uint256,int256)` = `c943e51a`, `setColorRgb(uint256,uint256,int256,int256,int256,int256)` = `f46a85a9`,
`getRow(uint256)` = `303a36e2`, `pixels(uint256,uint256)` = `69d640fd`, `check(bool,string,uint256)` = `b4c70cea` (0x1776281d only),
plus `owner`, `outbidPercent`, `feePercent`, `minPrice`, `setFeePercent`, `setMinPrice`, `setOutbidPercent`, `empty`.
The event topics confirm `Log(address,string,uint256)` and
`PixelChanged(uint256,uint256,address,int256,uint256,address,int256,uint256)`.
The names of struct fields, parameters and events aren't present in the bytecode. Those were chosen to follow the
verified Etherboard source by the same author.

## Verification

    node verify.js

Downloads soljson v0.1.6+commit.d41f8b7c, compiles `Etherboard.sol` with the optimizer ON, and checks the
runtime against `target_runtime.txt` and the full creation bytecode against `target_creation.txt` (both
fetched with `eth_getCode` / the deployment transaction input).

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | `address` | `owner` |
| 1 | `uint256` | `outbidPercent` (110) |
| 2 | `uint256` | `feePercent` (1) |
| 3 | `uint256` | `minPrice` |
| 4.. | `Pixel[1000][1000]` | `pixels` (4 slots per pixel: owner, lastChanged, color, price) |
