# Vitalik's "User Service" Caller — Serpent crack (EXACT)

**Verified by EthereumHistory (ethereumhistory.com)**

| | |
|---|---|
| **Address** | [0x6acc9a6876739e9190d06463196e27b6d37405c6](https://ethereumhistory.com/contract/0x6acc9a6876739e9190d06463196e27b6d37405c6) |
| **Deployer** | 0x1db3439a222c519ab44bb1144fc28167b4fa6ee6 (Vitalik Buterin) |
| **Deployment tx** | 0x6b565bc0b6853b0c67570c50b8e233e4a0f53769c2fd476938e086b085d1eb50 |
| **Deployed** | Oct 12, 2015 (block 370,511) |
| **Language** | Serpent (Vitalik's own language), not Solidity |
| **Runtime** | 851 bytes, byte-for-byte exact match |
| **runtime sha256** | `9642ec35587703931a8adfc7d830b0e1e0e7eeb7a9e927d4837072d6fdfbd669` |

## Source

`caller.se` is the "Caller/Responder Contract" from the ethereum/pyethapp wiki
"Making a User Service: Tutorial". It is a small Serpent front-end over an
external `get(string)` registry/oracle: `call` ABI-encodes the string `"cow"`,
emits a `LogResponse` event, then CALLs another contract's `get(url)` and records
the returned id in storage; `callback` reads that id back and re-emits the event.

Note: the deployed `callback` drops the `and msg.sender == 0xb3cd4c...` guard
shown in the wiki. It is just `if self.cbids[responseId]:`.

## Compiler

Serpent (ethereum/serpent) commit **f0b4128** (2015-10-15). It also matches at
146cc8a (2015-09-20). The latest v2.0.7 does NOT match: tighter string/call
codegen plus 3 extra memory words push the runtime to 857-893 bytes.

Solidity, in any version, provably cannot produce this bytecode. The
`600061027f53` init marker, the `5990590160009052` memory allocator, the raw
`LOG1` with a literal topic, and the identity-precompile (0x04) memory copies
are all Serpent codegen idioms.

## Files

- `caller.se` — original Serpent source (line 1 is the attribution comment, which
  the compiler strips, so it does not affect the bytecode)
- `target_runtime.txt` — on-chain runtime (851 bytes hex)
- `target_creation.txt` — on-chain creation bytecode (869 bytes hex)
- `creation_compiled.hex` — full creation bytecode emitted by the period compiler, identical to `target_creation.txt`
- `runtime_compiled.hex` — runtime sliced from `creation_compiled.hex`, identical to target
- `verify.sh` — recompiles in Docker and asserts the exact match

## Reproduce

```sh
./verify.sh
```

or manually:

```sh
docker run -d --platform linux/amd64 --name serpentbuild --entrypoint sleep serpent-compiler:latest infinity
docker cp caller.se serpentbuild:/caller.se
docker exec serpentbuild sh -c 'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null && ./serpent compile /caller.se'
# runtime = creation[14 : 14+LEN], LEN from the 61<LEN>80 preamble (= 0x0353 = 851)
```
