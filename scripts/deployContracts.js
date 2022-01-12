async function saveFrontendFiles(contracts) {
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const contractName = await contract.name();
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
      `${contractsDir}/${contractName}-contract-address.json`,
      JSON.stringify({ [contractName]: contract.address }, undefined, 2)
    );

    const ContractArtifact = artifacts.readArtifactSync(contractName);

    fs.writeFileSync(
      `${contractsDir}/${contractName}.json`,
      JSON.stringify(ContractArtifact, null, 2)
    );
  }
}

async function deployPixelToken() {
  const PixelToken = await ethers.getContractFactory("PixelToken");
  const pixelToken = await PixelToken.deploy();
  await pixelToken.deployed();

  console.log("PixelToken address:", pixelToken.address);

  return pixelToken;
}

async function deployPixelNFT() {
  const PixelNFT = await ethers.getContractFactory("PixelNFT");
  const pixel = await PixelNFT.deploy();
  await pixel.deployed();

  console.log("PixelNFT address:", pixel.address);

  return pixel;
}

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

  const pixelNFT = await deployPixelNFT();
  const pixelToken = await deployPixelToken();
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
