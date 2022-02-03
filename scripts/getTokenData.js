const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

require("dotenv").config();

const PINATA_JWT = process.env.PINATA_JWT;

const getTokenData = async (tokenUri) => {
  const axiosRes = await axios.get(tokenUri);
  console.log(axiosRes);
  return axiosRes.data;
};

const main = async () => {
  tokenUri =
    "https://gateway.pinata.cloud/ipfs/QmaNWWoXsXRQFaXauLvuCjw316AvEbG2adZ8xPdBbwY46h";
  const tokenData = await getTokenData(tokenUri);
  const jsonData = JSON.parse(tokenData);
  return jsonData;
};

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
