import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC20_Tradable_Vote } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { LinkedList } from "./helpers";

describe("OffChain voting tests", function () {
    let accounts: SignerWithAddress[];
    let adminAddress: string;

    async function deployContractFixture() {
        accounts = await ethers.getSigners();
        adminAddress = accounts[0].address;

        const initialPrice = ethers.parseUnits('0.01', 'ether');
        const initialTokenAmount = 1000000;
        const voteTime = 60;
        const buyFeePercentage = 100;
        const sellFeePercentage = 100;

        const contract = await ethers.deployContract("ERC20_Tradable_Vote", [
            initialTokenAmount,
            voteTime,
            initialPrice,
            adminAddress,
            buyFeePercentage,
            sellFeePercentage,
        ]) as ERC20_Tradable_Vote;

        return { contract, accounts, adminAddress, buyFeePercentage, sellFeePercentage, initialPrice, voteTime };
    }

    const vote = async (
        price: number,
        balance: BigInt,
        user: SignerWithAddress,
        contract: ERC20_Tradable_Vote,
        votingOffChain: LinkedList,
    ) => {
        const backupList = votingOffChain.clone();
    
        try {
            const voteUser = votingOffChain.vote(price, Number(balance) / 1e18, user.address);
    
            if (voteUser.type === "add") {
                await contract.connect(user).addPrice(
                    ethers.parseUnits(voteUser.price.toString(), 'ether'),
                    ethers.parseUnits(voteUser.weight.toString(), 'ether'),
                    voteUser.prev === null ? ethers.encodeBytes32String("") : voteUser.prev,
                    voteUser.next === null ? ethers.encodeBytes32String("") : voteUser.next,
                    voteUser.hash,
                );
            } else {
                await contract.connect(user).updateWeight(
                    voteUser.hash,
                    voteUser.next === null ? ethers.encodeBytes32String("") : voteUser.next,
                    voteUser.prev === null ? ethers.encodeBytes32String("") : voteUser.prev,
                    ethers.parseUnits(voteUser.weight.toString(), 'ether'),
                );
            }
        } catch (error) {
            console.error("Error occurred, rolling back changes:", error);
            votingOffChain.clear();
            Object.assign(votingOffChain, backupList);
        }
    };
    

    it("Test new voting", async function () {

        const { contract, voteTime } = await loadFixture(deployContractFixture);
        const votingOffChain = new LinkedList();

        const admin = accounts[0];
        const user1 = accounts[1];
        const user2 = accounts[2];
        const user3 = accounts[3];
        const user4 = accounts[4];

        // Send tokes to users
        await contract.connect(admin).transfer(user1.address, ethers.parseUnits('1000', 'ether'));
        await contract.connect(admin).transfer(user2.address, ethers.parseUnits('2000', 'ether'));
        await contract.connect(admin).transfer(user3.address, ethers.parseUnits('3000', 'ether'));
        await contract.connect(admin).transfer(user4.address, ethers.parseUnits('4000', 'ether'));


        const balanceUser1 = await contract.balanceOf(user1.address);
        const balanceUser2 = await contract.balanceOf(user2.address);
        const balanceUser3 = await contract.balanceOf(user3.address);
        const adminBalance = await contract.balanceOf(admin.address);
        expect(balanceUser1).to.equal(ethers.parseUnits('1000', 'ether'));
        expect(balanceUser2).to.equal(ethers.parseUnits('2000', 'ether'));
        expect(balanceUser3).to.equal(ethers.parseUnits('3000', 'ether'));

        // Start voting
        await contract.connect(admin).startVoting(admin.address);

        // Voting(user 1) New price = 100, weight = 1000
        await vote(100, balanceUser1, user1, contract, votingOffChain);
        
        // Voting(user 2) New price = 200, weight = 2000
        await vote(200, balanceUser2, user2, contract, votingOffChain);
        
        // await vote(200, ethers.parseUnits('10000', 'ether'), user2, contract, votingOffChain);
        // await vote(200, ethers.parseUnits('10000', 'ether'), user2, contract, votingOffChain);
        
        // Voting(user 3) New price = 300, weight = 3000
        await vote(300, balanceUser3, user3, contract, votingOffChain); 

        // Voting(admin) New Price 100 , weight - biggest
        await vote(100, adminBalance, admin, contract, votingOffChain); 

        
        

        // End voting
        await expect(contract.connect(admin).endVoting()).to.be.revertedWith("Voting is still ongoing");
        await time.increase(voteTime + 1);
        await contract.connect(admin).endVoting()
        
        
        const priceFromOnChain = Number(await contract.getPrice()) / 1e18;
        const priceFromOffChain = votingOffChain.getHighest();
        console.log(priceFromOnChain, priceFromOffChain);
        console.log(votingOffChain.display());
        
        
        expect(priceFromOnChain).to.equal(priceFromOffChain);

        votingOffChain.clear();
    });
});