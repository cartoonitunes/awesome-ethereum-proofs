# Serpent Gamble (provably-fair betting dapp) 0x59375871

| Field | Value |
|-------|-------|
| Address | `0x59375871ab51e8ffdf8d894071b330a3fa55b7d0` |
| Deployed | 2015-09-23 (block 276870) |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Creation tx | `0x07e979d23b6c27b37471d1c04fc242d5c8c24c95a987de72316389a54449e37d` |
| Language | Serpent |
| Compiler | ethereum/serpent commit f0b4128 |
| Runtime | 2387 bytes, byte-for-byte EXACT |
| Creation | 2426 bytes (constructor + runtime), byte-for-byte EXACT |
| Verification | `exact_bytecode_match` |

The full **serpent_gamble** provably-fair betting dapp. Canonical source is
`serpent_gamble/gamble.se` from ethereum/dapp-bin. Bettors call `bet(bettor_key, prob_milli)`
staking ETH and choosing their own win probability in per-mille; the contract locks the
`msg.value * (1000 - feeMillis) / prob_milli` potential payout against its balance and emits
`Bet`. The owner runs a commit-reveal seed scheme: `set_curseed(old_value, new_seed)` reveals
the previous seed, settles every open bet by comparing `sha3(old_value, bettor_key) / (2^256/1000)`
against each bet's probability (emitting `Win`/`Loss` and paying winners), then commits the next
seed hash with a 2-day deadline. If the owner fails to reveal within two days, anyone can call
`emergency_withdraw()` to refund all open bets and send the remainder to the Ethereum Foundation.
Owner administration uses a 5-block precommit via `unlock_for_administration()`.

## Source (serpent_gamble/gamble.se, ethereum/dapp-bin)

```
data owner
data curseed
data curseedExpiry
data bets[2**100](bettor, bettor_key, potential_winnings, prob_milli)
data numBets
data depositLocked
data canAdministerAfter
data feeMillis
data minProbMilli
event Bet(bettor:address, value:uint256, prob_milli:uint256)
event Win(index:uint256, bettor:address, potentialWinnings:uint256, prob_milli:uint256)
event Loss(index:uint256, bettor:address, potentialWinnings:uint256, prob_milli:uint256)
event UnlockForAdministration()
event LockForAdministration()
event NewSeed()

NOT_UNLOCKED = 2**100


def init():
    self.owner = msg.sender
    # Minimum 1% winning chance
    self.minProbMilli = 10


def const get_curseed():
    return(self.curseed:bytes32)


def const get_available_funds():
    return(self.balance - self.depositLocked)


def const get_administration_status():
    if self.canAdministerAfter == NOT_UNLOCKED:
        return(-1)
    elif self.canAdministerAfter > block.number:
        return(self.canAdministerAfter - block.number)
    else:
        return(0)


def unlock_for_administration():
    # Only owner can do this
    if msg.sender != self.owner:
        return(0:bool)
    # 5 block waiting period to change the current seed
    self.canAdministerAfter = block.number + 5
    log(type=UnlockForAdministration)


# Administrator method: supply the value for the old seed, process
# winnings and add a new seed
def set_curseed(old_value:bytes32, new_seed:bytes32):
    # Only owner can do this
    if msg.sender != self.owner:
        return(0:bool)
    # Must have precommitted and passed the waiting period 
    if self.canAdministerAfter > block.number:
        return(0:bool)
    # Must supply result for previous sha3
    if sha3(old_value) != self.curseed and self.curseed != 0:
        return(0:bool)
    i = 0
    numBets = self.numBets
    # 2**256 divided by 1000
    DIVCONST = 115792089237316195423570985008687907853269984665640564039457584007913129639
    # Run through bets, process payouts
    while i < numBets:
        rnd = ~div(sha3([old_value, self.bets[i].bettor_key]:arr), DIVCONST)
        if rnd < self.bets[i].prob_milli:
            send(self.bets[i].bettor, self.bets[i].potential_winnings)
            log(type=Win, i, self.bets[i].bettor, self.bets[i].potential_winnings, self.bets[i].prob_milli)
        else:
            log(type=Loss, i, self.bets[i].bettor, self.bets[i].potential_winnings, self.bets[i].prob_milli)
        self.bets[i].bettor = 0
        i += 1
    self.numBets = 0
    # Set the new seed hash, and a 2-day deadline for providing the next value
    self.curseed = new_seed
    self.curseedExpiry = block.timestamp + 86400 * 2
    # Reset the locked deposits
    self.depositLocked = 0
    # Reset the precommitment for administrative actions
    self.canAdministerAfter = NOT_UNLOCKED
    log(type=LockForAdministration)
    log(type=NewSeed)
    return(1:bool)


# If the value behind the curseed hash has not been revealed within 2 days
def emergency_withdraw():
    if block.timestamp <= self.curseedExpiry:
        return(0:bool)
    i = 0
    numBets = self.numBets
    while i < numBets:
        send(self.bets[i].bettor, self.bets[i].potential_winnings * self.bets[i].prob_milli / 1000)
        self.bets[i].bettor = 0
        i += 1
    # Donate all remaining funds to the Ethereum Foundation
    suicide(0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae)


# Make a bet
def bet(bettor_key:bytes32, prob_milli):
    # Maximum 100 bets to save on gas
    if self.numBets >= 100:
        send(msg.sender, msg.value)
        return(-1)
    potential_winnings = msg.value * (1000 - self.feeMillis) / prob_milli
    # Do we have enough to pay for the winnings?
    if self.balance - self.depositLocked < potential_winnings:
        send(msg.sender, msg.value)
        return(-2)
    # Is the prob_milli value too low?
    if prob_milli < self.minProbMilli:
        return(-3)
    # Lock up the deposit which would be used to pay winnings
    self.depositLocked += potential_winnings
    # Register the bet
    betIndex = self.numBets
    self.bets[betIndex].bettor = msg.sender 
    self.bets[betIndex].bettor_key = bettor_key
    self.bets[betIndex].potential_winnings = potential_winnings
    self.bets[betIndex].prob_milli = prob_milli
    self.numBets = betIndex + 1
    log(type=Bet, msg.sender, msg.value, prob_milli)
    return(betIndex)


# Owner withdraw profits (deposit simply by sending ether to the contract)
def withdraw(amount):
    # Must be the owner
    if msg.sender != self.owner:
        return(0:bool)
    # Must have precommitted and passed the waiting period 
    if self.canAdministerAfter > block.number:
        return(0:bool)
    # Maximum withdrawal
    if amount > self.balance - self.depositLocked:
        return(0:bool)
    send(self.owner, amount)
    # Reset the precommitment for administrative actions
    self.canAdministerAfter = NOT_UNLOCKED
    log(type=LockForAdministration)
    return(1:bool)


# Set fee
def set_fee_millis(millis):
    # Must be the owner
    if msg.sender != self.owner:
        return(0:bool)
    # Must have precommitted and passed the waiting period 
    if self.canAdministerAfter > block.number:
        return(0:bool)
    # Obvious restrictions
    if millis < 0 or millis > 999:
        return(0:bool)
    self.feeMillis = millis
    # Reset the precommitment for administrative actions
    self.canAdministerAfter = NOT_UNLOCKED
    log(type=LockForAdministration)
    return(1:bool)


# Get fee
def const get_fee_millis():
    return(self.feeMillis)


# Get the number of bets that have currently been made
def const get_num_bets():
    return(self.numBets)


# Get the data about a bet at a particular index
def const get_bet(betIndex):
    return([self.bets[betIndex].bettor, self.bets[betIndex].potential_winnings, self.bets[betIndex].prob_milli]:arr)
```

## Verification

```bash
docker exec serpentbuild sh -c 'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null && ./serpent compile /gamble.se'
```

Reproduces the deployed runtime (2387 bytes) and full creation code (2426 bytes) byte-for-byte.
runtime sha256 `f19b4b3bf158be5ee2905ffea48a5631d62d78aae72b2ed7c2acd766681a3664`; creation sha256 `e4e0e66d8071ffdcab2bb8321641231ba6770322033abb6bcb8b0628dcc55350`.
