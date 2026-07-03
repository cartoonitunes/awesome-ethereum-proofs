# WithdrawDAO Balance Split (0x74eeb52c)

| Field | Value |
|-------|-------|
| Address | `0x74eeb52c0ad5aa7fcd8f77355e427956ad3a2918` |
| Deployed | Jul 25, 2016 (block 1,951,725) |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Language | Serpent |
| Compiler | ethereum/serpent commit 9dc8c1c (also matches 9cec73c, 0a7a488) |
| Runtime | 158 bytes |
| Creation | 176 bytes |
| Verification | `exact_bytecode_match` — runtime and creation both byte-for-byte |

A one-function Serpent payment forwarder whose destination is gated on the ETH balance of the
**WithdrawDAO** refund contract (`0xbf4ed7b27f1d666546e30d74d50d173d20bca754`).

`split(addr1, addr2)`: if WithdrawDAO holds **more than 1,000,000 ETH** (1e24 wei), the contract
forwards its entire balance to `addr1`; otherwise it forwards to `addr2`. In both branches the
value sent is `balance(self)`, the contract's full balance, with zero gas stipend on the raw
`call`.

Deployed five days after the DAO hard fork (Jul 20, 2016), when the WithdrawDAO contract had just
been funded with the refunded ETH and was steadily draining as DAO token holders withdrew. The
1,000,000-ETH threshold acts as a switch on how far the refund had progressed, routing the payout
to one of two addresses accordingly. It is the on-chain sibling of the verified Serpent forwarder
[`0x6e9ccd1496ef424cb1e75eb1422eaac4d0aee851`](https://www.ethereumhistory.com/contract/0x6e9ccd1496ef424cb1e75eb1422eaac4d0aee851);
the two differ only in the evaluation order of the `call` arguments (this deployment writes
`call(0, addr, balance(self), ...)` where the sibling writes `call(0, balance(self), addr, ...)`),
which swaps two adjacent PUSH sequences in the emitted `CALL`.

## Source

```
def split(addr1:address, addr2:address):
    if balance(0xbf4ed7b27f1d666546e30d74d50d173d20bca754) > 1000000000000000000000000:
        call(0, addr1, balance(self), 0, 0, 0, 0)
    else:
        call(0, addr2, balance(self), 0, 0, 0, 0)
```

## Verification

```bash
docker run -d --platform linux/amd64 --name serpentbuild \
  --entrypoint sleep serpent-compiler:latest infinity
docker cp split.se serpentbuild:/split.se
docker exec serpentbuild sh -c \
  'cd /serpent && git checkout -q 9dc8c1c && make serpentc >/dev/null && ./serpent compile /split.se'
```

The emitted creation bytecode (176 bytes) equals the on-chain creation transaction input exactly;
the 158-byte runtime it deploys (`creation[14:172]`, per the `61009e` = copy-158 preamble) equals
`onchain_runtime.hex` exactly.

- runtime sha256 `d0ac74044583f30adbe2c1ecfabe4741bdc48720991929928d12b51d40ba0d6f`
- creation sha256 `f1ce5a141f0899fbfdb6362f99d663af1b09587078cf37a05677eca1be5b1933`
