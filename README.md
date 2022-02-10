# Pixel Node Marketplace

NFT Market place to sell NFTs from the PixelNFT solidity contract.

If you wish to create your own NFT art tokens consider the following Python package to create tokens and metadata.

Generative NFT Art: https://github.com/rounakbanik/generative-art-nft

The contract specifies Admins who are able to manage listings as well as Authors who are able to publish tokens to the marketplace.

The project includes a native Pixel token which is used to buy and sell NFT tokens. The owner of the Marketplace contract receives 10% of all NFT sales.

The project can be deployed to any solidity smart contract compatible blockchain. See how to guide for local development setup.

## Technologies

- React
- Material UI
- Hardhat (solidity development)

## How To:

1. Clone this repo

   `git clone git@github.com:subaquatic-pierre/pixel-node-marketplace.git`

2. Add images to scripts/images directory
3. Add metadata to scripts/images directory
4. Make sure token images and metadata have corresponding names ie.

   /scripts/image/1.png
   /scripts/meta/1.json

5. Install solidity dependencies from root directory

   `npm install`

6. Install frontend dependencies from within frontend directory

   `cd frontend`

   `npm install`

7. Run the following commands to deploy project to local environment

   `npx hardhat run scripts/deployContracts.js --network localhost`

   `npx hardhat run scripts/deployTokens.js --network localhost`
