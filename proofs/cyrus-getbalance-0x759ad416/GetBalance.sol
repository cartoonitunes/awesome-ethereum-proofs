// Cyrus Adkisson (0xcf684dfb...15bac), block 146,970 — Sep 4, 2015.
// One of Cyrus's early experimental contracts. Exposes the ether balance of a
// hardcoded address via a single constant getter. Verified byte-for-byte.
contract GetBalance {
    address a = 0xcf684dfb8304729355b58315e8019b1aa2ad1bac;
    function getMyBalance() constant returns (uint) {
        return a.balance;
    }
}
