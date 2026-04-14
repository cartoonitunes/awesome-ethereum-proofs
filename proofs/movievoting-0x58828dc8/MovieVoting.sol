contract MovieVoting {
    mapping(bytes32 => uint256) public bids;
    bytes32[] public movies;
    uint256 public movie_num;

    function vote(bytes32 key) {
        if (msg.value == 0) return;
        var bid = bids[key];
        if (bid == 0) {
            movie_num += 1;
            movies[movie_num - 1] = key;
        }
        bids[key] += msg.value;
    }
}
