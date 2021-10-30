pragma solidity >=0.4.0 <0.9.0;
import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        // Assign admin
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        // Token Contract
        // Token Price
    }
}
