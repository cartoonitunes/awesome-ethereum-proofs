# Vitalik Buterin's Oct 12, 2015 Serpent oracle / lottery set (5 contracts)

**Verified by EthereumHistory (ethereumhistory.com)**

Five contracts deployed by Vitalik Buterin on Oct 12, 2015 (Frontier), all compiled
with the period Serpent compiler (`ethereum/serpent` @ `f0b4128`, 2015-10-15). Every
one reproduces its **on-chain creation and runtime bytecode byte-for-byte**. They form
the two halves of a request/callback oracle — the same tutorial lineage as the
`caller.se` in `vitalik-lottery-0x6acc9a68`.

## The fetcher — `get(string)` (404-byte runtime)

`get(url)` requires ≥ 0.007 ETH, derives an id
`sha3(block.prevhash + sha3(url) + msg.sender + msg.value·2^160)`, stores it, emits
`GetRequest(string,address,uint256,uint256)`, returns the id, and `send`s the balance
to a beneficiary. Three deploys differ only in that beneficiary and the send/return order:

| Address | Beneficiary | Order | Source |
|---|---|---|---|
| `0x7e7f6373193baca61ca790dc95503b768bddf746` | `0xde0b2956…` (Vitalik) | return, then send | `get_0x7e7f.se` |
| `0x36517ccf7a16266de8b7cbd60db1f45a23f1eaf1` | `0xb3cd4c25…` | return, then send | `get_0x36517.se` |
| `0xd53096b3cf64d4739bb774e0f055653e7f2cd710` | `0xb3cd4c25…` | send, then return | `get_0xd53096.se` |

## The oracle caller — `callback` + `call`

`call(fetcher,url,fetchId)` invokes an external fetcher's `get(string)` and records
`cbids[returnedId] = fetchId`; `callback(response,responseId)` re-emits the response as
`LogResponse(string,uint256)` once matched.

| Address | Runtime | Difference | Source |
|---|---|---|---|
| `0xc861fc8dc9537159d94acbd662439046ea407166` | 610B | no `"cow"` log; `get(url)` without value | `oracle_0xc861.se` |
| `0xf938cbc60975a79101408fca21082f1e263300cd` | 850B | `log(LogResponse,"cow",0)` + `get(url,value=msg.value)` | `oracle_0xf938.se` |

The literal `"cow"` in `0xf938…` is a placeholder carried over from the tutorial source.

## Why Serpent, not Solidity

The `600061XXXX53` init marker, the `5990590160009052` memory allocator, raw `LOG1`
with a literal topic, and the identity-precompile (`0x04`) memory copies are all Serpent
idioms. No Solidity version produces this bytecode.

## Reproduce

```sh
./verify.sh      # recompiles all five in Docker, asserts exact match
```

Requires Docker and the `serpent-compiler:latest` image (`ethereum/serpent` @ `f0b4128`).

### runtime sha256

```
0x7e7f6373…  b6c27c0444b37d9f698679d820075844581d4a98b5ff47fa198998c7c4087b30
0x36517ccf…  0d2d40d6f79932d515af167535fdfda64e4fbbfa3ca6622722b0c6b899d460dd
0xd53096b3…  055412b45f147b2d9be9de026d2c00be693a4eadea135c7c48399231a68e7e33
0xc861fc8d…  140f7b14bda59fc114f18f48968a84fc30787d7a790ab1cea7fc1d9265245296
0xf938cbc6…  64a61241957f2d4753316732ba65ca6bc6a300aefe50df6e36552ae4ccb4678e
```

_Files: `get_*.se` / `oracle_*.se` sources (line 1 is the attribution comment, stripped
by the compiler), `tgt_<addr>.hex` on-chain creation bytecode, `verify.sh`, `compile.sh`,
`disasm.py`._
