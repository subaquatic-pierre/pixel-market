const buildContracts = require("./buildContracts");

async function createPrimaryTokens() {
  const { pixelNFT, pixelMarketplace } = await buildContracts();

  for (let i = 0; i < 3; i++) {
    const tokenUri = `http://localhost:8080/token-meta/${i}`;
    await pixelNFT.createToken(tokenUri);

    // Create listings
    if (i % 2 === 0) {
      await pixelMarketplace.createListing(i, i * 100);
    }
  }
}

async function createSecondaryTokens() {
  const testWallet1 = await new ethers.Wallet(
    "ba0048fb158346e9926aa3ac000c3e7bed6ee15ee13bfd70f68ef794e7f8aaef",
    ethers.provider
  );
  const { pixelNFT, pixelMarketplace } = await buildContracts(testWallet1);

  await pixelMarketplace.requestAuthorship(
    "Amazing Author",
    "amazing@author.com"
  );

  for (let i = 3; i < 6; i++) {
    const tokenUri = `http://localhost:8080/token-meta/${i}`;
    await pixelNFT.createToken(tokenUri);

    // Create listings
    if (i === 3 || i === 4) {
      await pixelMarketplace.createListing(i, i * 100);
    }
  }
}

async function sendPIX() {
  const { pixelToken } = await buildContracts();
  await pixelToken.transfer("0xb9d9c86CFEb92AC053945773159E39Cf4fb1125d", 1000);
}

async function main() {
  await createPrimaryTokens();
  await createSecondaryTokens();
  await sendPIX();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
