contract Bounce {
    function () {
        msg.sender.send(msg.value);
    }
}
