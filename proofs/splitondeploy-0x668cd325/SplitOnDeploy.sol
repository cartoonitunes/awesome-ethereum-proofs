// Verified by EthereumHistory (ethereumhistory.com)
contract SplitOnDeploy {
    function SplitOnDeploy() payable {
        address a = 0x1Db3439a222C519ab44bb1144fC28167b4Fa6eE6;
        address b = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
        a.send(msg.value / 2);
        b.send(msg.value / 2);
    }
}
