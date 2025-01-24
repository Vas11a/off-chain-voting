// import { ethers } from "hardhat";
// import { expect } from "chai";
// import hre from "hardhat";
// import { ERC20_Tradable_Vote } from "../../typechain-types";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import { startVoting } from "./helpers";
// import { time } from "@nomicfoundation/hardhat-network-helpers";


// describe("ERC20_Tradable_Vote Contract(vote part)", function () {
//   // info for innitial setup
//   let contract: ERC20_Tradable_Vote;
//   let accounts: SignerWithAddress[];
//   let adminAddress: string;
//   const initialPrice = ethers.parseUnits('0.01', 'ether');
//   const initialTokenAmount = 10000;
//   const voteTime = 60;
//   const buyFeePercentage = 100;
//   const sellFeePercentage = 100;

//   // global variables
//   const price = ethers.parseUnits('0.02', 'ether');

//   beforeEach(async function () {
//     accounts = await hre.ethers.getSigners();
//     adminAddress = accounts[0].address;


//     contract = await hre.ethers.deployContract("ERC20_Tradable_Vote", [
//       initialTokenAmount,
//       voteTime,
//       initialPrice,
//       adminAddress,
//       buyFeePercentage,
//       sellFeePercentage,
//     ]) as ERC20_Tradable_Vote;

//     console.log("Contract deployed to:", contract.target);
//   });


//   describe("startVoting", function () {
//     it("Should change votingStartTime and votingId, and emit VoteStarted event", async function () {
//       // Data before startVoting
//       const initialVotingId = +ethers.formatUnits(await contract.getVotingId(), 18);
//       const initialVotingStartedTime = await contract.getVotingStartTime();

//       await startVoting(contract, adminAddress);

//       const updatedVotingId = await contract.getVotingId();
//       const updatedVotingStartedTime = await contract.getVotingStartTime();

//       // Check data after startVoting
//       expect(updatedVotingId).to.equal(initialVotingId + 1);
//       expect(updatedVotingStartedTime).to.not.equal(initialVotingStartedTime);

//     });
//   });

//   describe("Vote", function () {
//     it("Vote transactions should pass or fail depending on the balance percentage", async function () {
//       const userWithEnoughTokens = accounts[1];
//       const userWithoutEnoughTokens = accounts[2];

//       // Calculate tokens for each user
//       const totalSupply = +ethers.formatUnits(await contract.totalSupply(), 18);

//       const enoughTokens = ethers.parseUnits((totalSupply * 0.05 / 100).toString(), 'ether')
//       const notEnoughTokens = ethers.parseUnits((totalSupply * 0.04 / 100).toString(), 'ether')

//       // Transfer tokens to users
//       await contract.transfer(userWithEnoughTokens.address, enoughTokens);
//       await contract.transfer(userWithoutEnoughTokens.address, notEnoughTokens);

//       startVoting(contract, adminAddress);

//       // Check that users can vote with 0.05% balance
//       await expect(contract.connect(userWithEnoughTokens).vote(price))
//         .to.emit(contract, "Vote")
//         .withArgs(price, userWithEnoughTokens.address);

//       // Check that users cannot vote with 0.04% balance
//       await expect(contract.connect(userWithoutEnoughTokens).vote(price))
//         .to.be.revertedWith("Insufficient tokens to vote");
//     })


//     it("Token transfers don’t allow users to double-spend tokens on voting", async function () {
//       const admin = accounts[0];
//       // Start voting
//       await startVoting(contract, admin.address);

//       // Make first vote from 1 user
//       // Should be successful
//       await expect(contract.connect(admin).vote(price))
//         .to.emit(contract, "Vote")
//         .withArgs(price, admin.address);

//       // Make second vote from 1 user
//       // Should be reverted
//       await expect(contract.connect(admin).vote(price))
//         .to.be.revertedWith("You have already voted");
//     })

//     it("Immpossible tranfer tokens if voting in progress and person has already voted", async function () {
//       const admin = accounts[0];
//       const user = accounts[1];
//       // Start voting
//       await startVoting(contract, admin.address);

//       // Admin voting
//       await expect(contract.connect(admin).vote(price))
//         .to.emit(contract, "Vote")
//         .withArgs(price, admin.address);

//       // Admin try to transfer tokens to user
//       const tokensToTransfer = ethers.parseUnits('100', 'ether');
//       await expect(contract.connect(admin).transfer(user.address, tokensToTransfer))
//         .to.be.revertedWith("You cannot perform this action while voting is active");
//     })

//     it("Cannot vote after voting time is up", async function () {
//       const admin = accounts[0];
//       // Start voting
//       await startVoting(contract, admin.address);

//       // Wait for voting time to pass
//       await time.increase(voteTime + 1);

//       // Try to vote
//       await expect(contract.connect(admin).vote(price))
//         .to.be.revertedWith("Voting has ended");
//     })

//   })
// });