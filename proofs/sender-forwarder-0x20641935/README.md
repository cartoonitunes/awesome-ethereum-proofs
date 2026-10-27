# Sender-Forwarder (0x20641935) — Runtime Bytecode Proof

Minimal Homestead-era contract with a public `sender` state variable settable
via `setSender()`, and a fallback that forwards `this.balance` to `sender.send()`.

| Field | Value |
|-------|-------|
| Address | `0x20641935dd380d1cbdc3b4fa3da47adcefa255d6` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 167 bytes — **exact byte-for-byte match** |
| Cluster | 12 identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |
