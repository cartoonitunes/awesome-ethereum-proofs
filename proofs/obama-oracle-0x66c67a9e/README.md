# Obama Oracle - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x66c67a9e26f5f1bf04c0e8797a4ae2f01db5785a` |
| Deployed | October 22, 2015 (block 422591) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` |
| Deploy tx | `0xa6a49e6751b48530dc2c445297d0c01354fd6b12899e5c6c4465479c4e662b8e` |
| Compiler | `soljson-v0.1.6+commit.d41f8b7c` |
| Optimizer | OFF |
| Runtime | 1,726 bytes |
| Creation | 2017 bytes (291 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `e7f7fdaef29a4192b53e23dbe6af3dbb92db00c5af293e95e7bfe6c02232b50e` |
| Creation SHA-256 | `1bc2e573bf5eab0a7a259472109138eca7c415631bbfb23ed416bd52645d05e8` |
| Byte match | 100.00% (diff 0 bytes) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

Obama Oracle is an early Oraclize demonstration contract deployed on October 22, 2015 (block 422,591) by 0x0047a8033cc6d6ca2ed5044674fd421f44884de8, the key Thomas Bertani used for his September 2015 Oraclize experiments. Two byte-identical copies followed within minutes at 0x593f6c40023183a3b6c0811d2612c31c1aaec4e0 (block 422,602) and 0x29b46a3f3fcc2353f6bef5d5bb6811ce75be3849 (block 422,609).

On deployment the constructor asks the Oraclize contract at 0xd4cb3eb955e03ac64644678fd3d6a7f3104ee70d to query WolframAlpha for "president of the United States". When the answer arrives from the Oraclize callback address 0x26588a9301b0428d95e6fc3a5024fce8bec12d51, the contract searches it for "Obama" with an on-chain indexOf. If the name is missing it self-destructs and sends its balance to the deployer; otherwise it queries WolframAlpha again. The owner can also destroy it with kill().

None of the three copies ever received a callback: each has only its creation transaction, and all three are still on chain, long after Obama left office in January 2017.

## Verification

`node verify.js` downloads the exact soljson compiler listed above, recompiles
`ObamaOracle.sol`, and compares the result byte-for-byte against the on-chain
runtime (`target_runtime.txt`) and creation (`target_creation.txt`) bytecode. It
must print the PASS lines and exit 0.

## Notes

- Selector `0x14ff041d` is a public `uint` initialised to 5 and never used. Its original name was not recovered: no name of 1-6 characters from `a-zA-Z0-9_` matches except 12 random collisions, and dictionary searches found nothing. The proof uses the collision `fOjqVd()`, which yields byte-identical bytecode; the true name has 7+ characters.
- The comparison is `indexOf(string(msg.data), "Obama") == -1`: soljson v0.1.6 evaluates the right operand first, so the `-1` is pushed before the call.
- Both the constructor and the callback assign the Oraclize contract to a local (`OraclizeI o = oracle; o.query(...)`); calling `oracle.query` directly is 3 bytes shorter per site.
- `owner`, the callback address and the Oraclize contract are `constant` addresses, inlined as PUSH19/PUSH20 at each use.
- The external call uses the early Oraclize API `query(uint256,string,string)` (`0xadf59f99`).

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | uint | fOjqVd (original name unknown; initialised to 5) |
