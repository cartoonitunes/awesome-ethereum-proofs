#!/usr/bin/env bash
# Self-contained reproduction: compiles caller.se with the period Serpent
# compiler and checks the runtime byte-for-byte against the on-chain code.
#
# Requires Docker with the serpent-compiler image (ethereum/serpent @ f0b4128,
# 2015-10-15). The on-chain runtime hash for 0x6acc9a68... is:
#   9642ec35587703931a8adfc7d830b0e1e0e7eeb7a9e927d4837072d6fdfbd669
set -euo pipefail
cd "$(dirname "$0")"

IMAGE=serpent-compiler:latest
CONTAINER=serpent-verify-vitalik

docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --platform linux/amd64 --name "$CONTAINER" --entrypoint sleep "$IMAGE" infinity >/dev/null
trap 'docker rm -f "$CONTAINER" >/dev/null 2>&1 || true' EXIT

docker cp caller.se "$CONTAINER":/caller.se
CREATION=$(docker exec "$CONTAINER" sh -c \
  'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null 2>&1; ./serpent compile /caller.se')

python3 - "$CREATION" <<'PY'
import sys, hashlib
creation = sys.argv[1].strip()
# Serpent preamble: 61<2-byte LEN>8061000e60003961<LEN>56 ; runtime begins at byte 14.
L = int(creation[2:6], 16)
runtime = creation[28:28 + L*2]
target = open('target_runtime.txt').read().strip()
h = lambda s: hashlib.sha256(bytes.fromhex(s)).hexdigest()
print(f"compiled runtime: {len(runtime)//2} bytes  sha256 {h(runtime)}")
print(f"on-chain runtime: {len(target)//2} bytes  sha256 {h(target)}")
if runtime == target:
    print("VERIFIED: exact bytecode match")
else:
    i = 0
    while i < min(len(runtime), len(target)) and runtime[i] == target[i]:
        i += 1
    sys.exit(f"FAIL at byte offset {i//2}")
PY
