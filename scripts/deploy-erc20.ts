import { ethers} from "hardhat";

async function main() {
    const accounts = await ethers.getSigners();
    const innitialPrice = ethers.parseUnits('0.01', 'ether');
    const innitialTokenAmount = 10000;
    const voteTime = 60;
    const adminAddress = "0xC95925676398F1793B28A9FD46cA0325CE9f614F";
    const buyFeePercentage = 1;
    const sellFeePercentage = 1;
    
    
    const test = await ethers.deployContract("ERC20_Tradable_Vote", [innitialTokenAmount, voteTime, innitialPrice, adminAddress, buyFeePercentage, sellFeePercentage], accounts[0]);
    console.log("Token contract deployed to address:", test.target);
    // console.log("Contract owner:", test.runner?.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
