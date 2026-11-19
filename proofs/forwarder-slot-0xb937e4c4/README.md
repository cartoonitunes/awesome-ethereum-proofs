# Forwarder (state-slot destination, 0xb937e4c4) — Runtime Bytecode Proof

Minimal ETH forwarder: payable fallback loads destination address from
state slot 0 and forwards `msg.value` via `.transfer()`. 114 bytes total.

| Field | Value |
|-------|-------|
| Address | `0xb937e4c459522050a81c79002f9cd228d767885d` |
| Compiler | soljson-v0.4.17+commit.bdeb9e52 |
| Optimizer | ON, runs=200 |
| Runtime | 114 bytes |
| Match type | Exact code match (swarm formatting delta) |
| Cluster | 144+ identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |
