# DigixDAO `Directory` library + `DigixConfiguration` — 18 exact bytecode matches

The earliest DigixDAO (Digix gold-token) on-chain infrastructure, deployed by **Anthony Eufemio**
(Digix CTO, GitHub `tymat`) in Nov 2015 – Jan 2016. Eighteen contracts, all matched byte-for-byte.

| Field | Value |
|-------|-------|
| Deployer | `0x4f53269e422711d4725f7381444c7f66f7d05788` (Anthony Eufemio / DigixDAO) |
| Compiler | native **solc v0.1.7 @commit c806b9bc** (Nov 26 2015) |
| Optimizer | **ON, `--optimize-runs 1`** |
| Source | [`DigixGlobal/ethereum-ruby`](https://github.com/DigixGlobal/ethereum-ruby) `contracts/Directory.sol` (verbatim) + reconstructed `DigixConfiguration.sol` |
| Verification | `exact_bytecode_match` — byte-for-byte runtime |

## What these are

- **`Directory`** — a typed-collection library over `mapping(address => bytes32/address/bool) storage self`
  (structs `AddressBytesMap`/`AddressAddressMap`/`AddressBoolMap`; verbs `insert`/`remove`/`contains`/`containsAndMatches`).
  Runtime 820 bytes, carries the native version stamp `650107c806b9bc50`. **9 identical deployments.**
- **`DigixConfiguration`** — an owner + admin-ACL + typed key→value config store. Each instance CALLCODEs
  a `Directory` clone (link-time address) for its admin set. Runtime 1290 bytes. **9 deployments**, each
  paired to one `Directory` clone.

## Addresses (9 + 9)

`Directory` library: `0xbce3b51c` `0x6fb33972` `0x91f23927` `0x333cc1bc` `0x8398b735` `0x3700a8e6`
`0xd9d8bba2` `0x236e8216` `0x9988ffcc`

`DigixConfiguration` → linked `Directory` (see `pairs.txt`):
`0x668d7db3`→`0x91f23927`, `0x2f7764fe`→`0x6fb33972`, `0x2e3efff0`→`0x8398b735`,
`0x64e56970`→`0xd9d8bba2`, `0x1230a115`→`0x236e8216`, `0xc0a2b0d6`→`0xbce3b51c`,
`0x8bbaf4cd`→`0x3700a8e6`, `0x6c3d82a1`→`0x333cc1bc`, `0x8568f930`→`0x9988ffcc`.

## How to reproduce

Build native solc v0.1.7 @c806b9bc (see repo `docker/DOCKER-BUILDS.md`, image `solc-c806b9bc`), then:

```bash
# Directory library (produces the 820B stamped runtime exactly)
solc --optimize --optimize-runs 1 --bin-runtime Directory.sol

# DigixConfiguration (produces 1290B runtime with a __Directory___…__ placeholder;
# substitute the placeholder with the paired library address to match each deployment)
solc --optimize --optimize-runs 1 --bin-runtime DigixConfiguration.sol
```

`--optimize-runs 1` is mandatory: it emits the compact `2**160-1` address mask
(`PUSH1 01 PUSH1 a0 PUSH1 02 EXP SUB`) rather than a literal `PUSH20 0xff..ff` (which is +26 bytes).

## Reconstructing the Jan-2016 `DigixConfiguration`

The committed `ethereum-ruby/DigixConfiguration.sol` (Oct 2015) is an earlier revision. The deployed
Jan-2016 version differs in exactly three ways (all needed for byte match):

1. Adds a third config map `mapping(bytes32 => bytes32) configbytes` (slot 4) + `addConfigEntryBytes`/
   `getConfigEntryBytes` + event `AddConfigEntryB`.
2. Drops the dead `_oldaddress` local reads in setters.
3. Mixed returns: `addConfigEntryAddr/Int/Bytes` and `registerAdmin` are `returns (bool)` (`return true;`);
   `setOwner` and `unregisterAdmin` are void.
