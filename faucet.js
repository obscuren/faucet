var abi = [{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"canSend","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"giveOut","outputs":[],"type":"function"}];

var shh = web3.shh;

// faucetContract is the global faucet contract which allows us to
// interact with.
var faucetContract = web3.eth.contract(abi).at("0xaf3ab9134df84cb37982a2dd8996c6dd6064a584");
// hand out amount in ether
var basicHandoutAmount = 20;
// triggerTopic is the trigger topic which trigger the faucet for payment.
var triggerTopic = "eth_faucet_gimme";
// create a new trigger filter which will wait for a possible payment.
var triggerFilter = shh.filter({topics:[triggerTopic]}, function(error, res) {
    console.log("ACTV LOG:", res);
    try {
        var instructions = JSON.parse(web3.toAscii(res.payload));

        var to = instructions.to;
        // short circuit if we can't send a transaction to this address.
        // Usually this means that the sender has recently requested a payment.
        if( !faucetContract.canSend(to, {}, "pending") ) {
            console.log("ACTV LOG: failure sending funds to", to);
            return;
        }

        console.log("ACTV LOG: sending funds to", to);
        faucetContract.giveOut(to, web3.toWei(basicHandoutAmount, "ether"), {gas: 400000, from: eth.accounts[0]});
    } catch(e) {
        console.log("FAIL:", e)
    }
});

function post(to) {
    shh.post({topics:[triggerTopic], payload: web3.toHex(JSON.stringify({to: to}))});
}
