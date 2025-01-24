// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC20_Tradable.sol";
import "../interfaces/IVotes.sol";
/**
 * @title ERC20_Tradable_Vote
 * @author Vasyl Panov
 */

contract ERC20_Tradable_Vote is ERC20_Tradable {
    uint256 internal _minTokenToVote;
    uint256 internal _minTokenToInitializeVoting;

    constructor(
        uint256 initialSupply_,
        uint256 timeToVote_,
        uint256 price_,
        address admin_,
        uint256 buyFeePercentage_,
        uint256 sellFeePercentage_
    )
        ERC20_Tradable(
            initialSupply_,
            timeToVote_,
            price_,
            admin_,
            buyFeePercentage_,
            sellFeePercentage_
        )
    {
        _minTokenToVote = (_totalSupply * 5) / 10000;
        _minTokenToInitializeVoting = (_totalSupply * 10) / 10000;
    }

    struct Node{
        bytes32 next;
        bytes32 prev;
        uint256 price;
        uint256 weight;
    }

    mapping (uint256 => mapping(bytes32 => Node)) public voting;
    mapping (uint256 => mapping(address => uint256)) public addressToPrice;
    mapping (uint256 => Node) public heads;


    function canUserVote(address addressSender) external view returns (bool) {
        require(block.timestamp < _votingStartTime + _timeToVote, "Voting has ended");
        require(_balances[addressSender] >= _minTokenToVote, "Insufficient tokens to vote");
        return true;
    }

    function startVoting(address addressSender) external returns (bool) {
        require(_votingStartTime == 0 || block.timestamp >= _votingStartTime + _timeToVote, "Voting is already active");
        require(_balances[addressSender] > _minTokenToInitializeVoting, "Insufficient tokens to propose a price");
        _votingStartTime = block.timestamp;
        _votingId += 1;
        return true;
    }

    function addPrice(uint256 price, uint256 weight, bytes32 prev, bytes32 next, bytes32 key, address addressSender) external onlyAdmin() returns (bool) {
        require(addressToPrice[_votingId][addressSender] == 0, "You have already voted");
        Node memory elem = Node(next, prev,price,weight);
        voting[_votingId][key] = elem;
        if (prev != bytes32(0)) {
            voting[_votingId][prev].next = key;
        } else {
            heads[_votingId] = Node(next, prev,price,weight);
        }
        if (next != bytes32(0)) {
            voting[_votingId][next].prev = key;
        }
        addressToPrice[_votingId][addressSender] = price;
        return true;
    }

    function updateWeight(bytes32 key, bytes32 newNext, bytes32 newPrev, bytes32 oldNext, bytes32 oldPrev, uint256 weight, address addressSender) onlyAdmin() external returns (bool) {
        
        voting[_votingId][key].weight = weight;
        voting[_votingId][key].next = newNext;
        voting[_votingId][key].prev = newPrev;
        if(oldPrev != bytes32(0)) {
            voting[_votingId][oldPrev].next = oldNext;
        }
        if(oldNext != bytes32(0)) {
            voting[_votingId][oldNext].prev = oldPrev;
        }
        if (newNext != bytes32(0)) {
            voting[_votingId][newNext].prev = key;
        }
        if (newPrev != bytes32(0)) {
            voting[_votingId][newPrev].next = key;
        }
        if (newPrev == bytes32(0)) {
            heads[_votingId] = Node(newNext, newPrev,voting[_votingId][key].price,weight);
        }
        addressToPrice[_votingId][addressSender] = voting[_votingId][key].price;
        return true;
    }

  



    function endVoting() external {
        require( block.timestamp >= _votingStartTime + _timeToVote, "Voting is still ongoing");
        _votingStartTime = 0;
        _price = heads[_votingId].price;
        clearVotingData();
    }

    function clearVotingData() internal onlyAdmin() {
        bytes32 currentKey = heads[_votingId].next;
        while (currentKey != bytes32(0)) {
            Node storage currentNode = voting[_votingId][currentKey];
            currentKey = currentNode.next;
            delete voting[_votingId][currentKey];
        }
        delete heads[_votingId];
    }


    function getWinner() external view returns (uint256 price, uint256 weight, bytes32 prev, bytes32 next) {
        return (heads[_votingId].price, heads[_votingId].weight, heads[_votingId].prev, heads[_votingId].next);
    }

}
