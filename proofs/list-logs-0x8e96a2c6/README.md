# On-chain Logs (list_logs) 0x8e96a2c6

| Field | Value |
|-------|-------|
| Address | `0x8e96a2c65e9fa8ef3a620afb6737bc870adefeec` |
| Deployed | 2015-10-25 (block 435333) |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Creation tx | `0xa2a10f3142716d6eb9ff1e631c0502dd8f746100797785b0d74515b18e404f04` |
| Language | Serpent |
| Compiler | ethereum/serpent commit f0b4128 |
| Runtime | 302 bytes, byte-for-byte EXACT |
| Creation | 324 bytes (constructor + runtime), byte-for-byte EXACT |
| Verification | `exact_bytecode_match` |

A minimal on-chain logging / journal contract. The canonical source is `list_logs/main.se`
from the ethereum/dapp-bin repository. `addLog(v)` emits a `Log(string)` event carrying an
arbitrary string, using the event log as append-only storage. `addBreak()` records the current
block number into storage slot 0 as a section marker, and `getLatestBreak()` returns that block
number. The constructor seeds the initial break with the deployment block.

## Source (list_logs/main.se, ethereum/dapp-bin)

```
event Log(value:string)
data break

def init():
    self.break = block.number

def addLog(v:str):
    log(type=Log, v)

def addBreak():
    self.break = block.number

def const getLatestBreak():
    return(self.break)
```

## Verification

```bash
docker exec serpentbuild sh -c 'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null && ./serpent compile /main.se'
```

Reproduces the deployed runtime (302 bytes) and full creation code (324 bytes) byte-for-byte.
runtime sha256 `43ca169c61105edc9bdefd34e56a60bebd5557ddeb87370560af99922305d7b6`; creation sha256 `0a4c37f63bdc8414c92ca5abf1565ba28b3e452d5d7fb682901ea900d6c5fec6`.
