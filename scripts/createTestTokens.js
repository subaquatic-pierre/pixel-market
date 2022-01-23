async function deployPixelMarketplace(NFTAddress, tokenAddress) {
  const PixelMarketplace = await ethers.getContractFactory("PixelMarketplace");
  const marketplace = await PixelMarketplace.deploy(NFTAddress, tokenAddress);
  await marketplace.deployed();

  console.log("PixelMarketplace address:", marketplace.address);

  return marketplace;
}

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const pixelMarketplace = await deployPixelMarketplace(
    pixelNFT.address,
    pixelToken.address
  );

  await saveFrontendFiles([pixelNFT, pixelToken, pixelMarketplace]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
