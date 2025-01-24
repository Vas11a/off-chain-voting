// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC20.sol";
import "../interfaces/ITradable.sol";

/**
 * @title ERC20_Tradable
 * @author Vasyl Panov
 */

contract ERC20_Tradable is ITradable, ERC20 {
    uint256 internal _lastBurnTime;
    uint256 internal _buyFeePercentage;
    uint256 internal _sellFeePercentage;

    constructor(
        uint256 initialSupply_,
        uint256 timeToVote_,
        uint256 price_,
        address admin_,
        uint256 buyFeePercentage_,
        uint256 sellFeePercentage_
    ) ERC20(initialSupply_, timeToVote_, price_, admin_) {
        _lastBurnTime = block.timestamp;
        _buyFeePercentage = buyFeePercentage_;
        _sellFeePercentage = sellFeePercentage_;
    }

    function getBuyFeePercentage() public view returns (uint256) {
        return _buyFeePercentage;
    }

    function getSellFeePercentage() public view returns (uint256) {
        return _sellFeePercentage;
    }

    /**
     * @inheritdoc ITradable
     */
    function buyTokens() external payable checkVoting returns (bool) {
        require(msg.value > 0, "Must send Ether to buy tokens");

        uint256 tokensToBuy = (msg.value * 1 ether) / _price;
        uint256 fee = (tokensToBuy * _buyFeePercentage) / 10000;
        uint256 tokensAfterFee = tokensToBuy - fee;

        _balances[msg.sender] += tokensAfterFee;
        _totalSupply += tokensToBuy;
        _balances[address(this)] += fee;

        emit Transfer(address(this), msg.sender, tokensAfterFee);
        return true;
    }

    /**
     * @inheritdoc ITradable
     */
    function sellTokens(
        uint256 tokenAmount_
    ) external checkVoting returns (bool) {
        require(tokenAmount_ > 0, "Must sell at least one token");
        require(
            _balances[msg.sender] >= tokenAmount_,
            "Insufficient tokens to sell"
        );
        uint256 fee = (tokenAmount_ * _sellFeePercentage) / 10000;
        uint256 tokensAfterFee = tokenAmount_ - fee;

        uint256 etherAmount = (tokensAfterFee * _price) / 1 ether;
        
        _balances[msg.sender] -= tokenAmount_;
        _balances[address(this)] += fee;
        payable(msg.sender).transfer(etherAmount);

        _totalSupply -= tokensAfterFee;

        emit Transfer(msg.sender, address(this), tokenAmount_);
        return true;
    }

    function setBuyFeePercentage(uint256 newFee) external onlyAdmin returns (bool) {
        require(newFee <= 10000, "Fee cannot exceed 100%");
        uint256 oldFee = _buyFeePercentage;
        _buyFeePercentage = newFee;
        emit BuyFeeUpdated(oldFee, newFee);
        return true;
    }

    function setSellFeePercentage(uint256 newFee) external onlyAdmin  returns (bool) {
        require(newFee <= 10000, "Fee cannot exceed 100%");
        uint256 oldFee = _sellFeePercentage;
        _sellFeePercentage = newFee;
        emit SellFeeUpdated(oldFee, newFee);
        return true;
    }

    /**
     * @inheritdoc ITradable
     */

    function burnAccumulatedFees() external returns (bool) {
    require(
        block.timestamp >= _lastBurnTime + 1 weeks,
        "Burn can only be done weekly"
    );

    uint256 accumulatedFees = _balances[address(this)]; 
    require(accumulatedFees > 0, "No fees to burn");

    _totalSupply -= accumulatedFees;

    _balances[address(this)] = 0;
    _lastBurnTime = block.timestamp;
    emit BurnAccumulatedFees();

    return true;
}

}
