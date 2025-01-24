// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

/**
 * @title ITradable
 * @author Vasyl Panov
 */

interface ITradable {
    /**
     * @notice Emitted when accumulated fees are burned.
     */
    event BurnAccumulatedFees();

    /**
     * @notice Emitted when accumulated fees are burned.
     * @param oldFee - The old fee percentage.
     * @param newFee - The new fee percentage.
     */
    event BuyFeeUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @notice Emitted when accumulated fees are burned.
     * @param oldFee - The old fee percentage.
     * @param newFee - The new fee percentage.
     */
    event SellFeeUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @notice Buys tokens by sending Ether to the contract.
     * @return success - True if the operation is successful.
     */
    function buyTokens() external payable returns (bool);

    /**
     * @notice Sells tokens to the contract for Ether.
     * @param tokenAmount_ - The amount of tokens the user wants to sell.
     * @return success - True if the operation is successful.
     */
    function sellTokens(uint256 tokenAmount_) external returns (bool);

    /**
     * @notice Sets the fee percentage for buying tokens.
     * @param newFee - The new fee percentage.
     * @return success - True if the operation is successful.
     */
    function setBuyFeePercentage(uint256 newFee) external returns (bool);

    /**
     * @notice Sets the fee percentage for selling tokens.
     * @param newFee - The new fee percentage.
     * @return success - True if the operation is successful.
     */
    function setSellFeePercentage(uint256 newFee) external returns (bool);

    /**
     * @notice Burns accumulated fees after a specific time period.
     * @return success - True if the operation is successful.
     */
    function burnAccumulatedFees() external returns (bool);
}
