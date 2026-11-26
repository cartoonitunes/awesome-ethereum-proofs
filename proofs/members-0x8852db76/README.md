# Members - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x8852db768551e89ac125f6a92450ef5e847a65e3` |
| Deployed | June 29, 2016 (block 1790164) |
| Deployer | `0xc3c4a610adb3636d905b6d73fd99f6ee5dcd31a6` |
| Deploy tx | `0x9fc2318f605d948e08f8c72a7f658c72785134347a15512d284e4ddd9ce12454` |
| Compiler | `soljson-v0.3.1+commit.c492d9be` |
| Optimizer | ON |
| Runtime | 3,087 bytes |
| Creation | 3539 bytes (452 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `bef2ae0f895028fa357236fa0d3f6869766e027c97b66bf5d8eba23110f20b39` |
| Creation SHA-256 | `ec797f7a6e0263cd12659d86a0c08b4a22779c8f9a5ec10b6c26b2f74fb2240f` |
| Byte match | 100.00% (diff 0 bytes) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

Members is a member registry with built-in payment splitting, deployed on June 29, 2016 by 0xc3c4a610adb3636d905b6d73fd99f6ee5dcd31a6. Its member bookkeeping (a members array with a dummy entry at index 0, a memberId lookup, and shift-down removal) follows the Congress example from the ethereum.org tutorials of the time. Any ether sent to the contract is divided equally among all registered members and logged as a PayOut event.

The owner can add and remove members, transfer ownership and destroy the contract; members can move their entry to a new address with changeMemberAddress, which does not update the memberId lookup for the new address. The constructor never sets an owner, so ownership goes to whoever first calls claimOwnership(). The contract sat unused until November 15, 2025, when 0xb17bfa989e00c7b0d17e52d3e90db440d2d7ee5f called claimOwnership() and nine minutes later transferred ownership to 0xd8df722f43700b017f48908bc0af05e7d203f957. Those are its only transactions besides the deployment.

## Verification

`node verify.js` downloads the exact soljson compiler listed above, recompiles
`Members.sol`, and compares the result byte-for-byte against the on-chain
runtime (`target_runtime.txt`) and creation (`target_creation.txt`) bytecode. It
must print the PASS lines and exit 0.

## Notes

- Compiled with soljson v0.3.1 release (optimizer ON), not the v0.3.5 used by the deployer's verified Creator factory. v0.3.3+ emits function bodies in selector order regardless of declaration order; v0.3.2 and earlier follow declaration order, which the target does.
- The storage-cleanup loop for the 2-slot `Member[]` array steps by 1 (`PUSH1 0x01 ADD`), a codegen bug fixed in the 2016-04-15 v0.3.1 nightly, which pins the build to v0.3.1 release or earlier nightlies.
- Event names were recovered by dictionary search against the full 32-byte topics: `MemberAdded`, `MemberRemoved`, `MemberUpdated` (all `address,string,uint256`) and `PayOut(uint256,uint256,uint256)`.
- `claimOwnership()` only works while `owner == 0`; the constructor only seeds `members[0] = Member(0, "")`.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | address | owner |
| 1 | mapping(address => uint) | memberId |
| 2 | Member[] {address member; string name} | members |
