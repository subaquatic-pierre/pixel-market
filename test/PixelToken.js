const { expect } = require("chai");
describe("Pixel Token contract", function () {
  let pixelToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("PixelToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    pixelToken = await factory.deploy();
    await pixelToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pixelToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await pixelToken.balanceOf(owner.address);
      expect(await pixelToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await pixelToken.transfer(addr1.address, 50);
      const addr1Balance = await pixelToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await pixelToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await pixelToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await pixelToken.balanceOf(owner.address);

      await expect(
        pixelToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await pixelToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pixelToken.balanceOf(owner.address);

      await pixelToken.transfer(addr1.address, 100);
      await pixelToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await pixelToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await pixelToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await pixelToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
