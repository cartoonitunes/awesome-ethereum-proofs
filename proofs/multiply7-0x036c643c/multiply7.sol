// Byte-exact for two frontier clusters of the canonical Solidity "multiply7" example:
//   0x036C643c9406bEEc42427174D7378b90638140e4 (21 deploys, 42B runtime) — solc 0.1.3 opt ON, creation-exact
//   0x13F993CA161862fE0B14586DEC2FD7e5f697BdED (12 deploys, 114B runtime) — solc 0.1.5 opt OFF, creation-exact
// Same source, two compiler settings ⇒ two distinct bytecode clusters.
contract Multiply7 { function multiply(uint256 a) constant returns (uint256 d) { return a * 7; } }
