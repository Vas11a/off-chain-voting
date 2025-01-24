import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "ethers";
import { ERC20_Tradable_Vote__factory } from "../../typechain-types";

export default buildModule("DeployToken", (m) => {
  const innitialPrice = parseUnits('0.01', 'ether');
  const innitialTokenAmount = 10000;
  const voteTime = 60;
  const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const buyFeePercentage = 1;
  const sellFeePercentage = 1;
  // console.log(ERC20_Tradable_Vote__factory.name);
  
  
  
  const contract = m.contract('ERC20_Tradable_Vote', [
    innitialTokenAmount,
    voteTime,
    innitialPrice,
    adminAddress,
    buyFeePercentage,
    sellFeePercentage
  ]);

  return { contract };
});