import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
 

    // Deploy the Contract
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);

    const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.deploy() as MyToken;
  await contract.deployed();
  console.log(`Token contract deployed at ${contract.address} by the address ${signer.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});