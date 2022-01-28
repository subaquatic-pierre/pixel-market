const buildContracts = require("./buildContracts");

async function main() {
  // This is just a convenience check
  const testWallet1 = await new ethers.Wallet(
    "ba0048fb158346e9926aa3ac000c3e7bed6ee15ee13bfd70f68ef794e7f8aaef",
    ethers.provider
  );

  const { pixelNFT, pixelMarketplace } = await buildContracts(testWallet1);

  for (let i = 0; i < 6; i++) {
    const tokenUri = `http://localhost:8080/token-meta/${i}`;

    // Create Token
    const tokenCreateRes = await pixelNFT.createToken(tokenUri);

    // Create listings
    if (i % 2 != 0) {
      const listingCreateRes = await pixelMarketplace.createListing(i, i * 100);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
