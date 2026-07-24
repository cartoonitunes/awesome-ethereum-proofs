#!/usr/bin/env bash
# Recompiles all five Serpent sources with the period compiler (ethereum/serpent
# @ f0b4128, 2015-10-15) and asserts an exact byte-for-byte match against the
# on-chain creation bytecode. Requires Docker + the serpent-compiler image.
set -euo pipefail
cd "$(dirname "$0")"

IMAGE=serpent-compiler:latest
CONTAINER=serpent-verify-lottery5
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --platform linux/amd64 --name "$CONTAINER" --entrypoint sleep "$IMAGE" infinity >/dev/null
trap 'docker rm -f "$CONTAINER" >/dev/null 2>&1 || true' EXIT
docker exec "$CONTAINER" sh -c 'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null 2>&1'

check() { # <source> <address>
  local src="$1" addr="$2"
  docker cp "$src" "$CONTAINER":/s.se >/dev/null
  local cre; cre=$(docker exec "$CONTAINER" sh -c 'cd /serpent && ./serpent compile /s.se')
  python3 - "$cre" "tgt_${addr}.hex" "$addr" "$src" <<'PY'
import sys,hashlib
cre=sys.argv[1].strip(); tgt=open(sys.argv[2]).read().strip().replace("0x","")
addr,src=sys.argv[3],sys.argv[4]
L=int(cre[2:6],16); rt=cre[28:28+L*2]
h=lambda s:hashlib.sha256(bytes.fromhex(s)).hexdigest()
if cre==tgt:
    print(f"OK  {addr}  {src:20s} runtime={L}B  sha256(rt)={h(rt)}")
else:
    i=0
    while i<min(len(cre),len(tgt)) and cre[i]==tgt[i]: i+=1
    sys.exit(f"FAIL {addr} {src}: diverge at byte {i//2}")
PY
}

check get_0x7e7f.se     0x7e7f6373193baca61ca790dc95503b768bddf746
check get_0x36517.se    0x36517ccf7a16266de8b7cbd60db1f45a23f1eaf1
check get_0xd53096.se   0xd53096b3cf64d4739bb774e0f055653e7f2cd710
check oracle_0xc861.se  0xc861fc8dc9537159d94acbd662439046ea407166
check oracle_0xf938.se  0xf938cbc60975a79101408fca21082f1e263300cd
echo "All five: exact byte-for-byte match."
