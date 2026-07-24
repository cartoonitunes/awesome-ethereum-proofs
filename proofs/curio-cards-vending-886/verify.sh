#!/usr/bin/env bash
# Near-exact verification of the Curio Cards vending-machine family (2017).
# One reconstructed source reproduces every size; size varies only by solc version +
# optimizer. Executable runtime matches on-chain byte-for-byte; only the trailing
# bzzr0 swarm hash differs (near_exact_match). Each size runs in its own node process.
set -e; cd "$(dirname "$0")"
node check_size.js 621 v0.4.7 1
node check_size.js 858 v0.4.8 0
node check_size.js 886 v0.4.11 0
node check_size.js 893 v0.4.14 0
echo "NEAR-EXACT MATCH: whole Curio vending-machine family verified (swarm hash differs)."
