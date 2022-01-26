const buildContracts = require("./buildContracts");

async function main() {
  // This is just a convenience check
  const { pixelNFT, pixelMarketplace } = await buildContracts();

  for (let i = 1; i < 6; i++) {
    const tokenUri = `http://localhost:8080/token-meta/${i}`;

    // Create Token
    const tokenCreateRes = await pixelNFT.createToken(tokenUri);

    // Create listings
    if (i % 2 == 0) {
      const listingCreateRes = await pixelMarketplace.createListing(i, i * 100);
    }

    console.log(tokenCreateRes);
    // console.log(listingCreateRes);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
