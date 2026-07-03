// Submitted by EthereumHistory (ethereumhistory.com)
// Digix — the earliest known attempt to deploy a smart contract on Ethereum mainnet.
// Deployed 2015-08-07 04:42:15 UTC (block 46,402) by Anthony Eufemio (thanateros.eth),
// address 0xA1E4380A3B1f749673E270229993eE55F35663b4. Later co-founded Digix / DigixDAO.
// The deploy ran out of gas (24,000 gas) before code deposit, so no runtime was stored;
// the creation code below reproduces the deployment transaction input byte-for-byte.
// Compiler: soljson v0.1.1+commit.6ff4cd6, optimizer ON.
contract Digix {
    address owner;
    function Digix() {
        owner = msg.sender;
    }
}
