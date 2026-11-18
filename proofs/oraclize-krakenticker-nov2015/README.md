# Oraclize KrakenTicker demos, early API (Nov 2015)

Six contracts deployed by Oraclize (`0x0047a8033cc6d6ca2ed5044674fd421f44884de8`) in November 2015. Each polls Kraken's ETH/XBT ticker every 60 seconds through Oraclize, stores the result in `ETHXBT`, and re-schedules itself from the callback.

They use an early version of the `usingOraclize` helper, published before Oraclize's public ethereum-api repository (first commit 14 December 2015). In that version, `oraclize_query` pays with `oraclize.send(getPrice)` before calling `query`, and the callback check goes through `cb_address()`. One version adds a 200,000 gas limit to the `getPrice` call.

Four distinct runtimes, each reproduced exactly with soljson v0.1.6+commit.d41f8b7c, optimizer on, compiled in a fresh process. See `proof.json` for which addresses each source covers.
