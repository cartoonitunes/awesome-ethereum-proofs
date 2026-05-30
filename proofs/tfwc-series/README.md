# TFWC fan-token series (2018 FIFA World Cup)

A small family of national-team and club-team fan tokens deployed across April to July 2018, around the 2018 FIFA World Cup. Most are deployed by a single wallet, `0x0022a370cdebaff99746b8a1311a8d9734bf3a28`, against the same `EthTeamContract` template. The Belgium and LIVERPOOL tokens are template precursors / cousins from different deployers.

## Contracts

| Country | Symbol | Address | Deployer | Source on Etherscan |
|---------|--------|---------|----------|---------------------|
| Russia | RUS | `0x0ffb3f4605dd9f01de1a06052b7687418a9d82ee` | `0x0022a370` | EthTeamContract |
| Morocco | MAR | `0xb85a54944b58342b07887942e6f530f616479efd` | `0x0022a370` | EthTeamContract |
| France | FRA | `0x7a2ac9691ce2fcffb9777311c14a82a6aec7e639` | `0x0022a370` | EthTeamContract |
| Croatia | HRV | `0xb389327f8325d9568826b0f3ca63ef613687cfab` | `0x0022a370` | EthTeamContract |
| Brazil | BRA | `0xd1a1929a2ff7ac033ed516430d0774e70c4ffb19` | `0x0022a370` | EthTeamContract |
| Belgium | BE | `0x63fd332e120b219f17f1512d530b3780d71ca7c5` | `0x95eabb17` | **UNVERIFIED** (extended 10kB variant) |
| Liverpool | LIV | `0x24ce35feecb226fb2238ebf551212cc8ad99cf28` | `0x71197b59` | TeamToken (template precursor, April 2018) |

## How the template works

The `EthTeamContract` shape:

- Each token has a fixed `price()` and a payable fallback that mints `(msg.value / price) * 1000` raw units (3 decimals) to the sender. So sending 0.001 ETH at a 1-szabo price gets you 1 full token.
- `transfer(this, amount)` is the sell path: burns the tokens and returns the ETH at the same price.
- A `status()` getter records "open" / "closed" state controlled by the owner.
- The contract holds a contract-level ETH balance until the owner withdraws.

The series is incomplete: of the 32 FIFA finalists in 2018, only five have a TFWC-NN-COUNTRY contract from the canonical deployer (Russia, Morocco, France, Croatia, Brazil). Belgium and Liverpool sit alongside the series under different authors and slightly modified templates.

## Crack status

- The five canonical TFWC tokens are Etherscan-verified directly. No reconstruction needed.
- LIVERPOOL is Etherscan-verified as `TeamToken` (an earlier April 2018 template).
- Belgium is **NOT cracked**. Its on-chain ABI matches the canonical TFWC template byte-for-byte at the selector level, but its runtime is roughly 2x the size of the verified siblings, so the source has additional logic. See `proofs/belgium-token-0x63fd332e/` for a dedicated writeup.

## Files

- `EthTeamContract.sol`, the Etherscan-verified source used by the five canonical TFWC tokens (Russia, Morocco, France, Croatia, Brazil).
- `TeamToken_Liverpool.sol`, the Etherscan-verified source for the LIVERPOOL precursor.

## References

- Canonical deployer: https://etherscan.io/address/0x0022a370cdebaff99746b8a1311a8d9734bf3a28
- Belgium deployer: https://etherscan.io/address/0x95eabb17d286483f6adfdfe0a88b66d894e7d296
- Liverpool deployer: https://etherscan.io/address/0x71197b59ec46f4ba8e30a5beda94be79b7b6e74e
