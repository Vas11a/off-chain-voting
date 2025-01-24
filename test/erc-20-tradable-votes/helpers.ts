import { ERC20_Tradable_Vote } from "../../typechain-types";
import { expect } from "chai";

export const startVoting = async (contract: ERC20_Tradable_Vote, address: string) => {
    const tx = await contract.startVoting();
    await tx.wait();
    await expect(tx).to.emit(contract, "VoteStarted").withArgs(address);
}