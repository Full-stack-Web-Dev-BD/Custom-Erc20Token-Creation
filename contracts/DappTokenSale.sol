pragma solidity >=0.4.0 <0.9.0;
import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public dappToken;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    // events
    event Sell(address _buyer, uint256 _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        // Assign admin
        admin = msg.sender;
        dappToken = _tokenContract;
        tokenPrice = _tokenPrice;
        // Token Contract
        // Token Price
    }

    // multiply
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfToken) public payable {
        require(msg.value == multiply(_numberOfToken, tokenPrice));
        require(dappToken.balanceOf(address(this)) >= _numberOfToken);
        require(dappToken.transfer(msg.sender, _numberOfToken)); // this is the  actual  buy functionality
        tokenSold += _numberOfToken;
        emit Sell(msg.sender, _numberOfToken);
    }
}
