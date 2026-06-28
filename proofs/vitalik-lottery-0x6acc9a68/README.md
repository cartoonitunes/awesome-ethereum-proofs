# Oracle Callback Service

**Verified by EthereumHistory (ethereumhistory.com)**

A Serpent contract that fetches off-chain data through an external fetcher contract
and records the result on-chain.

## What it does

EVM contracts cannot read a web page or call an API directly. Every node has to
re-execute a transaction and reach the same result, so outside data has to be
brought in deliberately. This contract does that with a two-step request and
callback flow.

1. `call(fetcher, url, fetchId)` takes the address of an external fetcher contract,
   a URL string, and a caller-supplied request id. It invokes the fetcher's
   `get(string)` method (ABI selector `693ec85e`), forwarding any attached ether,
   and stores `cbids[returnedId] = fetchId` so the later response can be matched to
   the original request.
2. `callback(response, responseId)` is invoked by the fetcher once it has the data.
   It reads `cbids[responseId]` and, if an entry exists, emits
   `LogResponse(response, fetchId)` carrying the fetched string. The caller and any
   off-chain listener read the result from that event.

State is a single storage array, `cbids`, mapping a fetcher's request id back to
the caller's `fetchId`. The only event is `LogResponse(response:string,
fetchId:uint256)`. Before dispatching a request, `call` also emits `LogResponse`
with the literal string `"cow"` and a `fetchId` of 0, a placeholder carried over
from the tutorial source the contract derives from.

The request and the response are two separate transactions: one to submit the
request, and a later one from the fetcher to deliver the answer. At deployment in
October 2015, Chainlink did not exist and Oraclize (later Provable) was only
beginning to appear.

The full source is in [`caller.se`](caller.se).

---

## Verification details

| | |
|---|---|
| **Address** | [0x6acc9a6876739e9190d06463196e27b6d37405c6](https://ethereumhistory.com/contract/0x6acc9a6876739e9190d06463196e27b6d37405c6) |
| **Deployer** | 0x1db3439a222c519ab44bb1144fc28167b4fa6ee6 (Vitalik Buterin) |
| **Deployment tx** | 0x6b565bc0b6853b0c67570c50b8e233e4a0f53769c2fd476938e086b085d1eb50 |
| **Deployed** | Oct 12, 2015 (block 370,511) |
| **Language** | Serpent, not Solidity |
| **Compiler** | ethereum/serpent commit f0b4128 (2015-10-15) |
| **Runtime** | 851 bytes, byte-for-byte exact match |
| **runtime sha256** | `9642ec35587703931a8adfc7d830b0e1e0e7eeb7a9e927d4837072d6fdfbd669` |

The source compiles to the on-chain bytecode exactly. Serpent commit f0b4128 also
matches at 146cc8a (2015-09-20); the later v2.0.7 does not, because tighter codegen
and 3 extra memory words push the runtime to 857 to 893 bytes. Solidity cannot
produce this bytecode in any version: the `600061027f53` init marker, the
`5990590160009052` memory allocator, the raw `LOG1` with a literal topic, and the
identity-precompile (0x04) memory copies are all Serpent idioms.

### Files

- `caller.se` original Serpent source (line 1 is the attribution comment, which the
  compiler strips, so it does not affect the bytecode)
- `target_runtime.txt` on-chain runtime (851 bytes hex)
- `target_creation.txt` on-chain creation bytecode (869 bytes hex)
- `creation_compiled.hex` full creation bytecode from the period compiler, identical to target
- `runtime_compiled.hex` runtime sliced from `creation_compiled.hex`, identical to target
- `verify.sh` recompiles in Docker and asserts the exact match

### Reproduce

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
