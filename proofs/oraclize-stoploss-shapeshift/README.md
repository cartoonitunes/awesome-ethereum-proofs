# Oraclize StopLoss / ShapeShift demos (2015)

Three contracts deployed by Oraclize (`0x0047a8033cc6d6ca2ed5044674fd421f44884de8`). Each asks Oraclize to call ShapeShift's `sendamount` API: a 0.2 ETH to BTC order paying out to a fixed Bitcoin address. The ShapeShift deposit address returned in the callback is parsed from hex into an Ethereum `address` and stored, the building block of an automated stop-loss.

Two distinct runtimes, both reproduced exactly with soljson v0.1.6+commit.d41f8b7c, optimizer off, compiled in a fresh process. One uses a `usingOraclize` base contract that stores the resolver address; the other is a single flat contract whose public variable is named `shapeshift`. See `proof.json`.
