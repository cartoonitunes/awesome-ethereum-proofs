# Etherboard prototype (0x8d4eac10) - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x8d4eac10d68745e2a8c36ab33c5c3961ed4b71be` |
| Deployed | November 6, 2015 22:02 UTC (block 500,859) |
| Deployer | `0x4f5b350b662fb17ca4ec22116e91dc1417b892bc` (also deployed [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)) |
| Deploy tx | `0x13a041770697b87a09f7eff122fa9389a420121742607018ce13bc4e8e77c143` |
| Compiler | `soljson-v0.1.6+commit.d41f8b7c` (any v0.1.4-nightly.2015.10.2 through v0.1.7 gives identical output) |
| Optimizer | ON |
| Runtime | 2,158 bytes |
| Creation | 2,215 bytes (no constructor arguments) |
| Runtime SHA-256 | `b7bc9fd613934a7efe5e6dccd311b280fbe3a36db6ec7f1a2787662221a425e5` |
| Creation SHA-256 | `b7b2fbbc8adfe52fb4e49f2f2598954006cd6ff82950fb5343502b50fbb5826d` |
| Byte match | 100% exact: runtime AND creation reproduced byte-for-byte |

## Contract

A 1000 x 1000 pixel board where anyone can buy a pixel and set its colour by sending ETH.
It's one of three prototypes the Etherboard author deployed on November 6-7, 2015, a week
before the final [Etherboard](https://ethereumhistory.com/contract/0x350e0ffc780a6a75b44cc52e1ff9092870668945)
(block 536,195, Etherscan-verified with v0.1.7).

Second prototype: identical to [0x24203423](../etherboard-proto-0x24203423/) except `setMinPrice`/`setFeePercent` now write the correct slots. Minimum price 50 finney. Saw about 2,000 transactions in 2015.

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
