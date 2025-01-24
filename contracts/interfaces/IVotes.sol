// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

/**
 * @title IVotes
 * @notice Interface for ERC20_Tradable_Vote contract.
 * @author Vasyl Panov
 */
interface IVotes {
    /**
     * @notice Emitted when voting is started.
     * @param initiator - The address that initiated the voting.
     */
    event VoteStarted(address indexed initiator);

    /**
     * @notice Emitted when voting ends and the price is decided.
     * @param price - The final price decided by the voting.
     */
    event VoteEnded(uint256 price);

    /**
     * @notice Emitted when a vote is cast.
     * @param price - The price being voted on.
     * @param initiator - The address that cast the vote.
     */
    event Vote(uint256 price, address indexed initiator);

    /**
     * @notice Starts a new voting process.
     * @return true if voting started successfully.
     */
    function startVoting() external returns (bool);

    /**
     * @notice Casts a vote for a specific price.
     * @param price_ - The price being voted on.
     * @return true if the vote was cast successfully.
     */
    function vote(uint256 price_) external returns (bool);

    /**
     * @notice Ends the current voting process and sets the final price.
     * @return true if the voting ended successfully.
     */
    function endVoting() external returns (bool);
}
