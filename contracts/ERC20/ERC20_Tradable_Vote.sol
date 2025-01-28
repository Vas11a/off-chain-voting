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


    function startVoting(address addressSender) external returns (bool) {
        require(_votingStartTime == 0 || block.timestamp >= _votingStartTime + _timeToVote, "Voting is already active");
        require(_balances[addressSender] > _minTokenToInitializeVoting, "Insufficient tokens to propose a price");
        _votingStartTime = block.timestamp;
        _votingId += 1;
        return true;
    }

    function addPrice(uint256 price, uint256 weight, bytes32 prev, bytes32 next, bytes32 key) external returns (bool) {
        require(addressToPrice[_votingId][msg.sender] == 0, "You have already voted");
        require(block.timestamp < _votingStartTime + _timeToVote, "Voting has ended");
        require(_balances[msg.sender] >= _minTokenToVote, "Insufficient tokens to vote");

        // Check that weight is greater than the previous element and less than the next element
        if(prev != bytes32(0)) {
            require(weight <= voting[_votingId][prev].weight, "Weight must be greater than the previous element");
        }
        if(next != bytes32(0)) {
            require(weight >= voting[_votingId][next].weight, "Weight must be less than the next element");
        }
        
        

        Node memory elem = Node(next, prev,price,weight);
        voting[_votingId][key] = elem;
        
        // If highest element, update head 
        if (prev != bytes32(0)) {
            voting[_votingId][prev].next = key;
        } else {
            heads[_votingId] = Node(next, prev,price,weight);
        }

        if (next != bytes32(0)) {
            voting[_votingId][next].prev = key;
        }

        // Add user and price to mapping
        addressToPrice[_votingId][msg.sender] = price;
        return true;
    }

    function updateWeight(bytes32 key, bytes32 next, bytes32 prev, uint256 weight) external returns (bool) {
        require(block.timestamp < _votingStartTime + _timeToVote, "Voting has ended");

        // Check that user has already voted
        if (voting[_votingId][key].price != addressToPrice[_votingId][msg.sender]) {
            require(addressToPrice[_votingId][msg.sender] == 0, "You have already voted");
        }

        // Check that weight is greater than the previous element and less than the next element
        if(prev != bytes32(0)) {
            require(weight <= voting[_votingId][prev].weight, "Weight must be greater than the previous element");
        }
        if(next != bytes32(0)) {
            require(weight >= voting[_votingId][next].weight, "Weight must be less than the next element");
        }

        // get old values
        bytes32 oldNext = voting[_votingId][key].next;
        bytes32 oldPrev = voting[_votingId][key].prev;


        // update links and values
        voting[_votingId][key].weight = weight;
        voting[_votingId][key].next = next;
        voting[_votingId][key].prev = prev;
        if(oldPrev != bytes32(0)) {
            voting[_votingId][oldPrev].next = oldNext;
        }
        if(oldNext != bytes32(0)) {
            voting[_votingId][oldNext].prev = oldPrev;
        }
        if (next != bytes32(0)) {
            voting[_votingId][next].prev = key;
        }
        if (prev != bytes32(0)) {
            voting[_votingId][prev].next = key;
        }
        if (prev == bytes32(0)) {
            heads[_votingId] = Node(next, prev,voting[_votingId][key].price,weight);
        }
        addressToPrice[_votingId][msg.sender] = voting[_votingId][key].price;
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
