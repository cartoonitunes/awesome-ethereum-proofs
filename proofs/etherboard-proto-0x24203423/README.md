# Etherboard prototype (0x24203423) - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x242034238b5d9c0001bc06320bb4cfd8d20d8ed4` |
| Deployed | November 6, 2015 21:37 UTC (block 500,761) |
| Deployer | `0x4f5b350b662fb17ca4ec22116e91dc1417b892bc` (also deployed [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)) |
| Deploy tx | `0x3c1ddd50c65758845c0b1732563cbb0df9a678767f60652709538061286aeeaa` |
| Compiler | `soljson-v0.1.6+commit.d41f8b7c` (any v0.1.4-nightly.2015.10.2 through v0.1.7 gives identical output) |
| Optimizer | ON |
| Runtime | 2,158 bytes |
| Creation | 2,215 bytes (no constructor arguments) |
| Runtime SHA-256 | `33155235c87a483eaf6d41eb6958c2978dffb21690a084d2eb44e1ab18572e34` |
| Creation SHA-256 | `0c65344faa6661752e3690492c716541984f8cd5d2632f5fbece8c163cada082` |
| Byte match | 100% exact: runtime AND creation reproduced byte-for-byte |

## Contract

A 1000 x 1000 pixel board where anyone can buy a pixel and set its colour by sending ETH.
It's one of three prototypes the Etherboard author deployed on November 6-7, 2015, a week
before the final [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)
(block 536,195, Etherscan-verified with v0.1.7).

First of three Etherboard prototypes. Minimum price 50 finney. **Original bug:** `setMinPrice` writes `feePercent` and `setFeePercent` writes `minPrice` (the two storage targets are swapped). Redeployed 25 minutes later as [0x8d4eac10](../etherboard-proto-0x8d4eac10/) with the setters fixed; that one-line swap is the only difference between the two runtimes.

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
