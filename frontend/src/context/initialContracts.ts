import { ethers } from "ethers";

import PixelNFTArtifact from "contracts/PixelNFT.json";
import pixelNFTAddress from "contracts/PixelNFT-contract-address.json";
import PixelTokenArtifact from "contracts/PixelToken.json";
import pixelTokenAddress from "contracts/PixelToken-contract-address.json";
import PixelMarketplaceArtifact from "contracts/PixelMarketplace.json";
import pixelMarketplaceAddress from "contracts/PixelMarketplace-contract-address.json";

export const buildContracts = (provider) => {
  const pixelNFT = new ethers.Contract(
    pixelNFTAddress.PixelNFT,
    PixelNFTArtifact.abi,
    provider.getSigner(0)
  );

  const pixelToken = new ethers.Contract(
    pixelTokenAddress.PixelToken,
    PixelTokenArtifact.abi,
    provider.getSigner(0)
  );

  const pixelMarketplace = new ethers.Contract(
    pixelMarketplaceAddress.PixelMarketplace,
    PixelMarketplaceArtifact.abi,
    provider.getSigner(0)
  );

  return {
    pixelNFT,
    pixelToken,
    pixelMarketplace,
  };
};
