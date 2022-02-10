const { expect } = require("chai");

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

describe("Pixel Marketplace contract", function () {
  let factory;
  let marketplace;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("PixelMarketplace");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const pixelNFT = await deployPixelNFT();
    const pixelToken = await deployPixelToken();

    marketplace = await factory.deploy(pixelNFT.address, pixelToken.address);
    await marketplace.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });
  });
});
