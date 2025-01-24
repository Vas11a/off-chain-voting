// import { ethers } from "hardhat";
// import { expect } from "chai";
// import hre from "hardhat";
// import { ERC20_Tradable_Vote } from "../../typechain-types";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// describe("ERC20_Tradable_Vote Contract (tradable part)", function () {
//     let accounts: SignerWithAddress[];
//     let adminAddress: string;

//     async function deployContractFixture() {
//         accounts = await ethers.getSigners();
//         adminAddress = accounts[0].address;

//         const initialPrice = ethers.parseUnits('0.01', 'ether');
//         const initialTokenAmount = 10000;
//         const voteTime = 60;
//         const buyFeePercentage = 100;
//         const sellFeePercentage = 100;

//         const contract = await ethers.deployContract("ERC20_Tradable_Vote", [
//             initialTokenAmount,
//             voteTime,
//             initialPrice,
//             adminAddress,
//             buyFeePercentage,
//             sellFeePercentage,
//         ]) as ERC20_Tradable_Vote;

//         return { contract, accounts, adminAddress, buyFeePercentage, sellFeePercentage, initialPrice };
//     }

//     it("Buy tokens", async function () {
//         const { contract, buyFeePercentage ,initialPrice } = await loadFixture(deployContractFixture);
        
//         const ethersAmount = ethers.parseUnits('0.1', 'ether'); 
//         const customerAddress = accounts[1];

//         const balanceBefore = await contract.balanceOf(customerAddress.address);

//         const contractBalanceBefore = await contract.balanceOf(contract.getAddress());

//         const totalSupplyBefore = await contract.totalSupply();
        
        

//         await contract.connect(customerAddress).buyTokens({ value: ethersAmount });

//         const balanceAfter = await contract.balanceOf(customerAddress.address);

//         const contractBalanceAfter = await contract.balanceOf(contract.getAddress());

//         const totalSupplyAfter = await contract.totalSupply();

//         const newTokens = ethersAmount * BigInt(1e18) / initialPrice;
//         expect(totalSupplyBefore + newTokens).to.equal(totalSupplyAfter);
//         expect(balanceBefore + newTokens-newTokens*BigInt(buyFeePercentage)/BigInt(10000)).to.equal(balanceAfter);
//         expect(contractBalanceBefore+newTokens*BigInt(buyFeePercentage)/BigInt(10000)).to.equal(contractBalanceAfter)
        

//     });

//     it("Sell tokens", async function () {
//         const { contract, sellFeePercentage ,initialPrice } = await loadFixture(deployContractFixture);
        
//         const ethersAmount = ethers.parseUnits('2', 'ether'); 
//         const tokensToTransfer = ethers.parseUnits('100', 'ether');
//         const customerAddress = accounts[1];

//         await contract.connect(customerAddress).buyTokens({ value: ethersAmount });

//         const balanceBefore = await contract.balanceOf(customerAddress.address);

//         const contractBalanceBefore = await contract.balanceOf(contract.getAddress());

//         const totalSupplyBefore = await contract.totalSupply();
        
        
    
//         await contract.connect(customerAddress).sellTokens(tokensToTransfer);

//         const balanceAfter = await contract.balanceOf(customerAddress.address);

//         const contractBalanceAfter = await contract.balanceOf(contract.getAddress());

//         const totalSupplyAfter = await contract.totalSupply();
        
//         const fee = tokensToTransfer * BigInt(sellFeePercentage) / BigInt(10000)
//         expect(totalSupplyBefore - tokensToTransfer + fee).to.equal(totalSupplyAfter);
//         expect(balanceBefore -tokensToTransfer).to.equal(balanceAfter);
//         expect(contractBalanceBefore+fee).to.equal(contractBalanceAfter)
//     });

//     it("Burn tokens", async function () {
//         const { contract } = await loadFixture(deployContractFixture);
        
//         await contract.connect(accounts[1]).buyTokens({ value: ethers.parseUnits('2', 'ether') });

//         const contractBalanceBefore = await contract.balanceOf(contract.getAddress());
//         const totalSupplyBefore = await contract.totalSupply();

//         expect(contractBalanceBefore).to.not.equal(0);

//         await expect(contract.connect(accounts[1]).burnAccumulatedFees())
//             .to.be.revertedWith("Burn can only be done weekly");
        
//         const oneWeekInSeconds = 7 * 24 * 60 * 60;
//         await time.increase(oneWeekInSeconds+1);

//         await contract.connect(accounts[1]).burnAccumulatedFees();

//         const totalSupplyAfter = await contract.totalSupply();
//         const contractBalanceAfter = await contract.balanceOf(contract.getAddress());
//         expect(contractBalanceAfter).to.equal(0);
//         expect(totalSupplyAfter).to.not.equal(totalSupplyBefore);
        
//     });

//     it("Set buy fee percentage", async function () {
//         const { contract } = await loadFixture(deployContractFixture);
//         const newBuyFeePercentage = 200;
//         const admin = accounts[0];
//         await contract.connect(admin).setBuyFeePercentage(newBuyFeePercentage);

//         const newBuyFeePercentageAfter = await contract.getBuyFeePercentage();
//         expect(newBuyFeePercentage).to.equal(newBuyFeePercentageAfter);

//         await expect(contract.connect(accounts[1]).setBuyFeePercentage(newBuyFeePercentage))
//             .to.be.revertedWith("Only admin can perform this action");
        
//     })

//     it("Set sell fee percentage", async function () {
//         const { contract } = await loadFixture(deployContractFixture);
//         const newSellFeePercentage = 200;
//         const admin = accounts[0];
//         await contract.connect(admin).setBuyFeePercentage(newSellFeePercentage);

//         const newBuyFeePercentageAfter = await contract.getBuyFeePercentage();
//         expect(newSellFeePercentage).to.equal(newBuyFeePercentageAfter);

//         await expect(contract.connect(accounts[1]).setBuyFeePercentage(newSellFeePercentage))
//             .to.be.revertedWith("Only admin can perform this action");
        
//     })


// });