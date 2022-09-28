const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners()

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("HelloWorld", deployer.address);

  await greeter.deployed();

  console.log("Contract Address : ", greeter.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});