pragma solidity ^0.4.11;

contract ERC20 {

    address public owner;
    string public constant name = "Dumai Test Token";
    string public constant symbol = "DuM";
    uint256 public constant decimals = 8;
    uint256 public constant totalSupply = 15 * 100 * 1000 * 1000 * 10 ** decimals;

    function ERC20()  {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }


    function transfer(address _to, uint256 _value)  returns (bool success) {
        require(balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    mapping(address => uint256) public balances; // *added public
    mapping(address => mapping(address => uint256)) public allowed; // *added public

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transferOwnership(address newOwner) {
        if (msg.sender != owner) {
            throw;
        }
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

    function bathTransfer(address [] _to, uint256 [] _value)  returns (bool success) {
        require(_to.length == _value.length);
        uint256 totalValue = 0;
        for (uint i = 0; i < _to.length; i++) {
            require(balances[_to[i]] + _value[i] > balances[_to[i]]);
            totalValue = totalValue + _value[i];
        }
        require(balances[msg.sender] >= totalValue);
        for (uint j = 0; j < _to.length; j++) {
            transfer(_to[j], _value[j]);
        }
        return true;
    }

    function testError(uint256 _num)  returns (bool success) {
        if (_num == 1) {
            require(1 > 2);
        } else if (_num == 2) {
            throw;
        } else {
            assert(1 > 2);
        }
        return true;
    }

}
