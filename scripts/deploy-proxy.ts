import { ethers } from "hardhat";

async function main() {
    const mainContractAddress = '0x9A676e781A523b5d0C0e43731313A708CB607508';
    const adminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const accounts = await ethers.getSigners();
    
    
    const test = await ethers.deployContract("Proxy", [mainContractAddress, adminAddress], accounts[0]);
    console.log("Proxy contract deployed to address:", test.target);
    // console.log("Contract owner:", test.runner?.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
