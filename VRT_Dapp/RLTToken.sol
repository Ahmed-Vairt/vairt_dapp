pragma solidity 0.4.18;


contract VRTTOKEN {

    struct TOKEN {
        string name;
        string symbol;
        uint256 id;
        uint8 decimals;
        uint256 balance;
    }

    struct Request {
        bool investorConsent;
        uint256 investorReleaseValue;
        uint256 investorTokenId;
        bool tokenOwnerConsent;
        uint256 tokenOwnerReleaseValue;
        uint256 tokenOwnerTokenId;
    }

    mapping(address => TOKEN[]) public balances;
    mapping(address => TOKEN[]) public vested;
    mapping(address => uint256) public dinvest;
    mapping(address => Request) public investmentReleaseRequest;

    address private owner;
    uint private constant TOTALVRTVSSUPPLY = 10000000;
    uint private constant TOTALVRTNONVSSUPPLY = 50000000;

    /*
    contract constructor 
    */
    function VRTTOKEN() public {
        balances[msg.sender].push(TOKEN("Real Block Token", "VRT_Vested", 1, 3, 10000000));
        balances[msg.sender].push(TOKEN("Real Membership A", "VRT_NonVested", 2, 1, 50000000));
        owner = msg.sender;
    }

    /*
    Returns owner of the Token 
    */
    function getOwner() public constant returns(address ownerAddress) {
        return owner;
    }

    /*
    Return Supply of given token 
    */
    function totalSupply(uint256 tokenId) public constant returns (uint256 _supplyBalance) {
        if (tokenId == 1) {
            return TOTALVRTVSSUPPLY;
        } else if (tokenId == 2) {
            return TOTALVRTNONVSSUPPLY;
        }
        return 0;
    }

    function balanceOf(address _owner, uint256 tokenId) public constant returns(uint256 vrtBalance) {
        return getTokenBalance(_owner,tokenId);
    }

    /*
    Function perform token balance from one account to other account
    */
    function transfer(address _to, uint256 _value, uint256 tokenId) public returns(bool success) {
        uint256 senderBalance = getTokenBalance(msg.sender, tokenId);
        uint256 vestedBalce = getVestedBalance(msg.sender, tokenId);
        if (tokenId == 1) {
            if (_to != owner && _value > 0 && senderBalance >= _value && senderBalance - vestedBalce > 0) {
                setTokenBalance(msg.sender, _value, tokenId, false);
                setTokenBalance(_to, _value, tokenId, true);
                Transfer(msg.sender, _to, _value);
                return true;
            } else {
                return false;
            }
        }
    }


    /*
    This function can only be executed by owner of the token, it performs 3 mains actions
    1- add balance to invested tokens for given address
    2- reduce owner balance 
    3- raise investment event
    */
    function investment(address _to, uint256 _value, uint256 tokenId) public returns(bool success) {
        uint256 senderBalance = getTokenBalance(msg.sender, tokenId);

        if (_to != owner && _value > 0 && senderBalance > 0 && senderBalance > _value && msg.sender == owner && tokenId == 1) {
            setTokenVested(_to, _value, tokenId, true);
            setTokenBalance(_to, _value, tokenId, true);
            setTokenBalance(msg.sender, _value, tokenId, false);
            Investment(_to,_value);
            return true;
        } else {
            return false;
        }
    }

    /*
    This function can be executed by owner of the token or by holder of the investment, it performs 3 mains actions
    1- Add Token owner and investor consent to release given value
    2- if both consent are added release the tokens so investor can transfer or preform other actions
    3- raise d-investment event
    */
    function dinvestment(address _from, uint256 _value, uint256 tokenId) public returns(bool success) {

        if ( (msg.sender == owner || _from == msg.sender) && tokenId == 1) {
            if (msg.sender == owner) {
                investmentReleaseRequest[_from].tokenOwnerConsent = true;
                investmentReleaseRequest[_from].tokenOwnerReleaseValue = _value;
                investmentReleaseRequest[_from].tokenOwnerTokenId = tokenId;
                Dinvestment(_from, _value);
            } else {
                investmentReleaseRequest[_from].investorConsent = true;
                investmentReleaseRequest[_from].investorReleaseValue = _value;
                investmentReleaseRequest[_from].investorTokenId = tokenId;
                Dinvestment(_from, _value);
            }

            if (investmentReleaseRequest[_from].investorConsent == investmentReleaseRequest[_from].tokenOwnerConsent && investmentReleaseRequest[_from].investorReleaseValue == investmentReleaseRequest[_from].tokenOwnerReleaseValue && investmentReleaseRequest[_from].investorTokenId == investmentReleaseRequest[_from].tokenOwnerTokenId) {
                setTokenVested(_from, _value, tokenId, false);
                delete investmentReleaseRequest[_from];
            }
            return true;
        } else {
            return false;
        }
    }

    /*
    Get investor's invested Balance
    */
    function vestedBalance(address _investor, uint256 tokenId) public constant returns(uint256 vestedAmount) {
        return getVestedBalance(_investor, tokenId);
    }

    /*
    This is internal function , which returns NEW TOKEN Value based on if 
    */
    function getTokenById (uint256 id, uint256 _value) private constant returns (TOKEN tkn) {

        if (id == 1) {
            return TOKEN("Real Block Token", "VRT_Vested", 1, 3, _value);
        }else if (id == 2) {
            return TOKEN("Real Membership A", "VRT_NonVested", 2, 1, _value);
        }
    }

    /*
    This is internal function , which returns balance of account owner 
    */
    function getTokenBalance (address _owner, uint256 tokenId) private constant returns(uint256 vrtBalance) {
        uint arrayLength = balances[_owner].length;
        for (uint i = 0; i < arrayLength; i++) {
            if (balances[_owner][i].id == tokenId) {
                return balances[_owner][i].balance;
            }
        }
        return 0;
    }

    /*
    This is internal function , which returns vested-balance of account owner 
    */
    function getVestedBalance (address _owner, uint256 tokenId) private constant returns (uint256 vrtBalance) {
        uint256 balance = 0;
        uint arrayLength = vested[_owner].length;
        for (uint i = 0; i < arrayLength; i++) {
            if (vested[_owner][i].id == tokenId) {
                return vested[_owner][i].balance;
            }
        }
        return balance;
    }

    /*
    This is internal function , which sets vested-balance of account owner 
    */
    function setTokenVested(address addr, uint256 _value, uint256 tokenId, bool isAddCalled) private returns(bool success) {
        uint arrayLength = vested[addr].length;
        bool isUpdateBalance = false;
        for (uint i = 0; i < arrayLength; i++) {
            if (vested[addr][i].id == tokenId) {
                if (isAddCalled) {
                    vested[addr][i].balance += _value;
                } else {
                    vested[addr][i].balance -= _value;
                }
                isUpdateBalance = true;
            }
        }

        if (!isUpdateBalance && isAddCalled) {
            vested[addr].push(getTokenById(tokenId, _value));
        }
        return true;
    }

    /*
    This is internal function , which sets balance of account owner 
    */
    function setTokenBalance (address addr, uint256 _value, uint256 tokenId, bool isAddCalled) private returns(bool success) {
        uint arrayLength = balances[addr].length;
        bool isUpdateBalance = false;
        for (uint i = 0; i < arrayLength; i++) {
            if (balances[addr][i].id == tokenId) {
                if (isAddCalled) {
                    balances[addr][i].balance += _value;
                }else {
                    balances[addr][i].balance -= _value;
                }
                isUpdateBalance = true;
            }
        }

        if (!isUpdateBalance && isAddCalled) {
            balances[addr].push(getTokenById(tokenId, _value));
        }
        return true;
    }

    event Investment(address indexed _to, uint256 _value);
    event Dinvestment(address indexed _from, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    //***************************************** END OF CONTRACT *********************************    
}
