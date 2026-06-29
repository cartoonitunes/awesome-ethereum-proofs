contract Lotto {

    uint constant public blocksPerRound = 10;
    uint constant public ticketPrice = 100000000000000000;
    uint constant public blockReward = 5000000000000000000;

    function getBlocksPerRound() constant returns(uint){ return blocksPerRound; }
    function getTicketPrice() constant returns(uint){ return ticketPrice; }

    struct Round {
        address[] tickets;
        uint pot;
        mapping(uint=>bool) isCashed;
    }
    mapping(uint => Round) rounds;

    function getRoundIndex() constant returns (uint){
        return block.number/blocksPerRound;
    }

    function getIsCashed(uint roundIndex,uint subpotIndex) constant returns (bool){
        return rounds[roundIndex].isCashed[subpotIndex];
    }

    function calculateWinner(uint roundIndex, uint subpotIndex) constant returns(address){
        var decisionBlockNumber = getDecisionBlockNumber(roundIndex,subpotIndex);

        if(decisionBlockNumber>block.number)
            return;

        var decisionBlockHash = getHashOfBlock(decisionBlockNumber);
        var winningTicketIndex = decisionBlockHash%rounds[roundIndex].tickets.length;

        return rounds[roundIndex].tickets[winningTicketIndex];
    }

    function getDecisionBlockNumber(uint roundIndex,uint subpotIndex) constant returns (uint){
        return ((roundIndex+1)*blocksPerRound)+subpotIndex;
    }

    function getSubpotsCount(uint roundIndex) constant returns(uint){
        var subpotsCount = rounds[roundIndex].pot/blockReward;

        if(rounds[roundIndex].pot%blockReward>0)
            subpotsCount++;

        return subpotsCount;
    }

    function getSubpot(uint roundIndex) constant returns(uint){
        return rounds[roundIndex].pot/getSubpotsCount(roundIndex);
    }

    function cash(uint roundIndex, uint subpotIndex){

        var subpotsCount = getSubpotsCount(roundIndex);

        if(subpotIndex>=subpotsCount)
            return;

        var decisionBlockNumber = getDecisionBlockNumber(roundIndex,subpotIndex);

        if(decisionBlockNumber>block.number)
            return;

        if(rounds[roundIndex].isCashed[subpotIndex])
            return;

        var winner = calculateWinner(roundIndex,subpotIndex);
        var subpot = getSubpot(roundIndex);

        winner.send(subpot);

        rounds[roundIndex].isCashed[subpotIndex] = true;
    }

    function getHashOfBlock(uint blockIndex) constant returns(uint){
        return uint(block.blockhash(blockIndex));
    }

    function getTickets(uint roundIndex) constant returns (address[]){
        return rounds[roundIndex].tickets;
    }

    function getPot(uint roundIndex) constant returns(uint){
        return rounds[roundIndex].pot;
    }

    function() {
        var roundIndex = getRoundIndex();
        var value = msg.value-(msg.value%ticketPrice);

        if(value==0) return;

        if(value<msg.value){
            msg.sender.send(msg.value-value);
        }

        var ticketsCount = value/ticketPrice;
        var ticketIndex = rounds[roundIndex].tickets.length;
        rounds[roundIndex].tickets.length = rounds[roundIndex].tickets.length + ticketsCount;

        for(var i=0;i<ticketsCount;i++){
            rounds[roundIndex].tickets[ticketIndex+i] = msg.sender;
        }

        rounds[roundIndex].pot+=value;
    }

}
