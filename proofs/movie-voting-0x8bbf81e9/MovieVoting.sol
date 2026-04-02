contract MovieVoting {
    mapping(bytes32 => uint) public bids;
    bytes32[] public movies;
    uint public movie_num;
    function vote(bytes32 movie) {
        if (msg.value == 0) return;
        uint b = bids[movie];
        if (b == 0) {
            movies[movie_num++] = movie;
        }
        bids[movie] += msg.value;
    }
}
