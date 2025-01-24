// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ERC20
 * @notice Default ERC20 implementation.
 * @author Vasyl Panov
 */

contract ERC20 {
    string internal _name = "TestERC20";
    string internal _symbol = "TEERC";
    uint8 internal _decimals = 18;

    uint256 internal _totalSupply;

    uint256 internal _price;
    address internal _admin;

    uint256 internal _timeToVote;
    uint256 internal _votingId;
    uint256 internal _votingStartTime;

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    mapping(address => uint256) internal _balances;
    mapping(address => mapping(address => uint256)) internal _allowances;

    constructor(
        uint256 initialSupply_,
        uint256 timeToVote_,
        uint256 price_,
        address admin_
    ) {
        _totalSupply = initialSupply_ * 10 ** uint256(_decimals);
        _balances[msg.sender] = _totalSupply;
        _price = price_;
        _admin = admin_;

        _timeToVote = timeToVote_;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }

    function getName() public view returns (string memory) {
        return _name;
    }

    function getSymbol() public view returns (string memory) {
        return _symbol;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        _admin = newAdmin;
    }

    modifier checkVoting() {
        require(
                block.timestamp >= _votingStartTime + _timeToVote,
            "You cannot perform this action while voting is active"
        );
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only admin can perform this action");
        _;
    }

    function getVotingId() public view returns (uint256) {
        return _votingId;
    }

    function getVotingStartTime() public view returns (uint256) {
        return _votingStartTime;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public checkVoting returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public checkVoting returns (bool) {
        require(_balances[sender] >= amount, "Insufficient balance");
        require(
            _allowances[sender][msg.sender] >= amount,
            "Allowance exceeded"
        );
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
