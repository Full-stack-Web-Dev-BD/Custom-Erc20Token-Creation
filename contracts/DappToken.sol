pragma solidity >=0.4.0 <0.9.0;

contract DappToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    string public standerd = "DApp Token v1.0";
    mapping(address => uint256) public balanceOf;
    // allowance
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // transfer event

    constructor(
        uint256 _initialSupply,
        string memory _name,
        string memory _symbol
    ) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // _spender is  upcomming owner by the transection
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        // allowance
        // approve event
        emit Approve(msg.sender, _spender, _value);
        return true;
    }
    // transferFrom
}
