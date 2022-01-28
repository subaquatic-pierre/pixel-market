const PixelNFTArtifact = require("./contracts/PixelNFT.json");
const pixelNFTAddress = require("./contracts/PixelNFT-contract-address.json");
const PixelTokenArtifact = require("./contracts/PixelToken.json");
const pixelTokenAddress = require("./contracts/PixelToken-contract-address.json");
const PixelMarketplaceArtifact = require("./contracts/PixelMarketplace.json");
const pixelMarketplaceAddress = require("./contracts/PixelMarketplace-contract-address.json");

async function buildContracts(wallet) {
  let signer;
  if (wallet) {
    signer = wallet;
  } else {
    const [deployer] = await ethers.getSigners();
    signer = deployer;
  }

  const pixelNFT = new ethers.Contract(
    pixelNFTAddress.PixelNFT,
    PixelNFTArtifact.abi,
    signer
  );

  const pixelToken = new ethers.Contract(
    pixelTokenAddress.PixelToken,
    PixelTokenArtifact.abi,
    signer
  );

  const pixelMarketplace = new ethers.Contract(
    pixelMarketplaceAddress.PixelMarketplace,
    PixelMarketplaceArtifact.abi,
    signer
  );

  const contracts = { pixelNFT, pixelToken, pixelMarketplace };
  return contracts;
}

module.exports = buildContracts;
