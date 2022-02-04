const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const buildContracts = require("./buildContracts");
require("dotenv").config();

// Set Constants
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";
const PINATA_JWT = process.env.PINATA_JWT;

const uploadImage = async (tokenId) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Get image
  let data = new FormData();
  const file = fs.createReadStream(`${__dirname}/images/pinataTest.jpg`);

  // Add image to data
  data.append("file", file);

  // Set image meta
  const imageMeta = JSON.stringify({
    name: `token-id-${tokenId}-image`,
  });
  data.append("pinataMetadata", imageMeta);

  const headers = {
    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    Authorization: `Bearer ${PINATA_JWT}`,
  };

  const options = {
    maxBodyLength: "Infinity",
    headers,
  };

  try {
    const axiosRes = await axios.post(url, data, options);
    const IpfsHash = axiosRes.data.IpfsHash;
    const imageUri = `${IPFS_GATEWAY}/${IpfsHash}`;
    return imageUri;
  } catch (err) {
    console.log(err);
  }
};

const uploadMetaData = async (tokenId, imageUri) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  // Create metadata
  const tokenMeta = {
    pinataMetadata: {
      name: `token-id-${tokenId}-meta`,
    },
    pinataContent: {
      tokenId: tokenId,
      imageUri: imageUri,
      name: "The World",
      description:
        "The most amazing world, it exists within the life of experience",
      attributes: [
        {
          trait_type: "Base",
          value: "Starfish",
        },
        {
          trait_type: "Eyes",
          value: "Big",
        },
        {
          trait_type: "Light Year Distance",
          value: "42",
        },
      ],
    },
  };
  const headers = {
    Authorization: `Bearer ${PINATA_JWT}`,
  };

  const options = {
    maxBodyLength: "Infinity",
    headers,
  };

  try {
    const axiosRes = await axios.post(url, tokenMeta, options);
    const IpfsHash = axiosRes.data.IpfsHash;
    const tokenUri = `${IPFS_GATEWAY}/${IpfsHash}`;
    return tokenUri;
  } catch (err) {
    console.log(err);
  }
};

const createToken = async (tokenUri, tokenId) => {
  const { pixelNFT, pixelMarketplace } = await buildContracts();

  const res = await pixelNFT.createToken(tokenUri);

  //   await pixelNFT.approve(pixelMarketplace.address, tokenId);

  //   const res = await pixelMarketplace.createListing(tokenId, 42);
  return res;
};

const main = async () => {
  const tokenId = "8";
  const imageUri = await uploadImage(tokenId);
  const tokenUri = await uploadMetaData(tokenId, imageUri);
  const res = await createToken(tokenUri);
  return res;
};

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
