import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken, MyToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
    const tokenContract = process.argv[2];
    const targetBlockNumber = process.argv[3];
    // 7950620 

    console.log("Deploying Tokenized Ballot contract");
    console.log("Proposals: ");
    const proposals = process.argv.slice(4);
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    // Deploy the Contract
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);

    const lastBlock = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${lastBlock.number}`);
    const contractFactory = new TokenizedBallot__factory(signer);
  const contract = await contractFactory.deploy(convertStringArrayToBytes32(proposals),tokenContract,targetBlockNumber) as TokenizedBallot;
  await contract.deployed();
  console.log(`Tokenized Ballot contract deployed at ${contract.address} by the address ${signer.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});