const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const buildContracts = require("./buildContracts");
require("dotenv").config();

// Set Constants
const IMAGE_DIR = `${__dirname}/images`;
const META_DIR = `${__dirname}/meta`;
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";
const PINATA_JWT = process.env.PINATA_JWT;

const getTokenIdFromFilename = (filename) => {
  const name = path.parse(filename).name;
  const id = name.replace(/^0+/, "");
  if (id === "") {
    return "0";
  }
  return id;
};

const uploadImage = async (filename) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const tokenId = getTokenIdFromFilename(filename);

  // Get image
  let data = new FormData();
  const file = fs.createReadStream(`${IMAGE_DIR}/${filename}`);

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
    const image = `${IPFS_GATEWAY}/${IpfsHash}`;
    return [image, tokenId];
  } catch (err) {
    console.log(err);
  }
};

const uploadMetaData = async (tokenId, image) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const rawData = fs.readFileSync(`${META_DIR}/${tokenId}.json`);
  const tokenData = JSON.parse(rawData);
  tokenData.tokenId = tokenId;
  tokenData.image = image;

  // Create metadata
  const jsonData = {
    pinataMetadata: {
      name: `token-id-${tokenId}-meta`,
    },
    pinataContent: tokenData,
  };
  const headers = {
    Authorization: `Bearer ${PINATA_JWT}`,
  };

  const options = {
    maxBodyLength: "Infinity",
    headers,
  };

  console.log(jsonData);

  try {
    const axiosRes = await axios.post(url, jsonData, options);
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

  //   const res = await pixelMarketplace.createListing(tokenId, 100);
  return res;
};

const getImages = () => {
  var fs = require("fs");
  var files = fs.readdirSync(IMAGE_DIR);
  return files;
};

const main = async () => {
  const files = getImages();

  for (filename of files) {
    try {
      const [image, tokenId] = await uploadImage(filename);
      const tokenUri = await uploadMetaData(tokenId, image);
      const res = await createToken(tokenUri);
      // return 'yo';
    } catch (err) {
      console.log(err);
      continue;
    }
  }
  return "Complete";
};

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
