# Oraclize Devcon1 PriceTicker demos (Nov 2015)

29 contracts deployed by Oraclize (`0x0047a8033cc6d6ca2ed5044674fd421f44884de8`) around Devcon1 in London, 9-13 November 2015. Each is the Oraclize `PriceTicker` example. It fetches the ETH/XBT price from Kraken's public ticker through Oraclize and stores it in `ETHXBT`. Most versions pay for the query with the coupon `DEVCON1`.

Six distinct runtimes, each reproduced exactly with soljson v0.1.6+commit.d41f8b7c, optimizer on, compiled in a fresh process. They differ in:

- whether `update()` carries `coupon("DEVCON1")`;
- the query delay (`0` or `60` seconds, or no timestamp argument);
- whether `oraclize_setProofType(byte)` carries the `oraclizeAPI` modifier;
- whether `__callback` re-schedules `update()`;
- function declaration order.

See `proof.json` for which addresses each source covers.
