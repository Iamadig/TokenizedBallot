import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

const MINT_Value = ethers.utils.parseEther("10");
async function main() {
    const contractAddress = process.argv[2];
    //0xDD4AAD77F7dE34563E174523294dE09E634A313e
    const targetAddress = process.argv[3];

    // Attach to the Contract
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const contractFactory = new MyToken__factory(signer);
    const contract = contractFactory.attach(
        contractAddress
      );
      console.log(`Attached to the contract ${contractAddress}`);
      //console.log(`Attached to the contract ${contractAddress} and the minter role blongs to ${contract.MINTER_ROLE()}`);
      

  // //Mint some tokens
  const mintTx = await contract.mint(targetAddress, MINT_Value);
  await mintTx.wait(); 

  const balanceBN = await contract.balanceOf(targetAddress);
  console.log( `Account ${targetAddress} has ${balanceBN.toString()} units of My Tokens`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});