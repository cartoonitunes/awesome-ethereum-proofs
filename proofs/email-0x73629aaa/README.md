# On-chain Email (0x73629aaa)

| Field | Value |
|-------|-------|
| Address | `0x73629aaa79aa9d44596ced948871b379f3cda2e2` |
| Deployed | Oct 30, 2015 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Language | Serpent |
| Compiler | ethereum/serpent commit 146cc8a (f0b4128 also matches) |
| Runtime | 493 bytes |
| Verification | `exact_bytecode_match` — runtime byte-for-byte |

A pay-to-send on-chain "email" service. `email(a, b, c)` takes three strings (recipient, subject,
body); if the caller pays at least 0.007 ETH it emits an `Email(string, string, string)` event
carrying the three strings and forwards the fee to the owner stored at `storage[0]`. The message
lives entirely in the event log — a whimsical 2015 demonstration of using logs as a message bus.

## Source

```
event Email(a:string, b:string, c:string)

def email(a:string, b:string, c:string):
    if msg.value >= 7000000000000000:
        log(type=Email, a, b, c)
        send(self.storage[0], self.balance)
```

## Verification

```bash
docker exec serpentbuild sh -c 'cd /serpent && git checkout -q 146cc8a && make serpentc >/dev/null && ./serpent compile /email.se'
```

Reproduces the 493-byte runtime in `onchain_runtime.hex` byte-for-byte. runtime sha256 `ce909f0eea2f7dbe4006ff7359e56bbbab7ccab79bb92600466ee993f62c3404`.
