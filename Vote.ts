import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken, MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

//const MINT_Value = ethers.utils.parseEther("10");
async function main() {
    const contractAddress = process.argv[2];
    const voteIndex = process.argv[3];
    const voteAmount = process.argv[4];
    //Token - 0xDD4AAD77F7dE34563E174523294dE09E634A313e
    //Tokenized Ballot - 0x21c87FFa574Bd6D8AbF9Ef12db1e18eb7845b485
    // Attach to the Contract
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const contractFactory = new TokenizedBallot__factory(signer);
    const contract = contractFactory.attach(
        contractAddress
      );
      console.log(`Attached to the contract ${contractAddress}`);

    //display proposals and ask for Votes
    for (let index = 0; index < 4 ; index++) {
        const proposalres = await contract.proposals(index);
        console.log(`Index ${index}. ${ethers.utils.parseBytes32String(proposalres.name)}`);
      }

    const voteTx = await contract.vote(voteIndex,voteAmount);
     voteTx.wait();
     const votedProposal = await contract.proposals(voteIndex);
     console.log(`${signer.address} voted with ${voteAmount} amount of votes for the ${ethers.utils.parseBytes32String(votedProposal.name)}`);
     
     const winnerIndex = await contract.winningProposal();
     const winningProposal = await contract.proposals(winnerIndex);
     console.log(`The winning proposal as of now is ${ethers.utils.parseBytes32String(winningProposal.name)}`) 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});