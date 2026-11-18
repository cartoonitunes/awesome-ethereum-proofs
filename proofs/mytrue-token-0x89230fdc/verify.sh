#!/usr/bin/env bash
# usage: SOLJSON=path/to/soljson-v0.2.0+commit.4dc2445e.js ONE=path/to/one.js ./verify.sh
set -e; cd "$(dirname "$0")"
r=$("${NODE:-node}" "$ONE" "$SOLJSON" MyToken.sol 0 MyToken /tmp/mytrue_creation.hex)
[ "$r" = "$(cat runtime.hex)" ] && echo "runtime EXACT" || { echo "runtime MISMATCH"; exit 1; }
[ "$(cat /tmp/mytrue_creation.hex)" = "$(cat creation_tx_input.hex)" ] && echo "creation EXACT" || echo "creation differs"
