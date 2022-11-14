import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

//const MINT_Value = ethers.utils.parseEther("10");
async function main() {
    const contractAddress = process.argv[2];
    //0xDD4AAD77F7dE34563E174523294dE09E634A313e
    const targetAddress = process.argv[3];
    const MINT_Value = process.argv[4];

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


//Transfer tokens
const transferTx = await contract
.connect(signer)
.transfer(targetAddress, ethers.utils.parseEther(MINT_Value));
await transferTx.wait();
const votesAfter2 = await contract.balanceOf(targetAddress);
console.log( `Account ${targetAddress} has ${votesAfter2.toString()} units of votes AFTER self delgating`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});