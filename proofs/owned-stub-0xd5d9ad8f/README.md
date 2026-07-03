# Owner-recording stub (0xd5d9ad8f…) — Hudson Jameson, 89 seconds before the Marriage Registry

Deployed by **Hudson Jameson** (`0x80d63799b1e08a80f73fb7a83264b5c31600bf3a`), Ethereum Foundation
community manager and long-time organizer of the core-dev calls, on **2016-01-02 06:48:39 UTC** —
block **908,565**. It is a minimal test contract deployed **89 seconds before** his well-known
[Marriage Registry](https://ethereumhistory.com/contract/0x58641cded077270a319f509e0266e96837cc79f4)
(`0x58641c…`, 06:50:08), evidently a warm-up in the same session.

**Runtime and creation bytecode both reproduce byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Address | `0xd5d9ad8f8b6a83a69dfa6500f99dfd337c34c814` |
| Deployed | 2016-01-02 06:48:39 UTC |
| Block | 908,565 |
| Deployer | `0x80d63799b1e08a80f73fb7a83264b5c31600bf3a` (Hudson Jameson) |
| Creation tx | `0x5b757728c1ac5762f1764c648ae24e76d6202cd2e3f2c5102585bed3be234368` |
| Runtime | 6 bytes (`0x606060405200`) — **EXACT match** |
| Creation | 40 bytes — **EXACT match** |
| Language | Solidity |
| Compiler | **soljson v0.1.5+commit.23865e39**, optimizer **ON** (matches the sibling Marriage Registry) |
| Runtime SHA-256 | `eb04cef08cdddee4f09d3b6f9e1293eece8503f9b6155a85e6b7b9aba70d080f` |

## What it is

An empty contract with a single constructor that records the deployer in slot 0. The runtime is the
6-byte empty body `0x606060405200` (`PUSH1 0x60 PUSH1 0x40 MSTORE STOP`) — no callable functions.

```solidity
contract Stub {
    address owner;
    function Stub() {
        owner = msg.sender;
    }
}
```

The compiler is pinned to **v0.1.5 optimizer ON** to match the Marriage Registry deployed 89
seconds later from the same address (see the
[Hudson Jameson collection](https://ethereumhistory.com/collections/hudson-jameson)). The tight
init layout (runtime at CODECOPY offset `0x22`, no trailing `STOP` pad) rules out v0.1.1, which
would place it at `0x23`.

## Verify

```bash
npm install solc@0.4.26
node verify.js   # → ✅ EXACT MATCH  (creation bytecode)
```

## Attribution

Reconstructed by [Ethereum History](https://ethereumhistory.com). Contract page:
https://ethereumhistory.com/contract/0xd5d9ad8f8b6a83a69dfa6500f99dfd337c34c814
