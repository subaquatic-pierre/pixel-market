const { expect } = require("chai");

describe("Pixel NFT contract", function () {
  let factory;
  let pixelNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("PixelNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    pixelNFT = await Token.deploy();
    await pixelNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pixelNFT.owner()).to.equal(owner.address);
    });
  });
});
