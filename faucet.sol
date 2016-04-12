contract Faucet {
	// set the owner
	address owner = msg.sender;
	// isOwner will not resume if the sender is not the initialiser
	// (i.e. the faucet application).
	modifier isOwner() { if(msg.sender == owner) _ }

	// lastRequest determines the last payment to this specific address
	mapping(address => uint) lastRequest;
	// lockout determines the lockout period
	uint constant lockout = 10 minutes;

	// canSend checks the last request and makes sure the requested is
	// illigeable for a payout.
	function canSend(address who) constant returns(bool) {
		return lastRequest[who] + lockout < now; 
	}

	// giveOut sends the amount to the recipient.
	function giveOut(address recipient, uint amount) {
        // make sure recipient can receive and isn't locked out.
        if( !canSend(recipient) ) throw;
        // send the amount to the recipient.
		recipient.send(amount);
        // set the last request for the lock out period.
        lastRequest[recipient] = now;
	}
}
