const { expect } = require("chai");

describe("Pixel Marketplace contract", function () {
  let factory;
  let marketplace;
  let marketplace;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("PixelMarketplace");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    marketplace = await factory.deploy();
    await marketplace.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });
  });
});
