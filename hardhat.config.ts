import "@nomiclabs/hardhat-waffle";

// Import tasks
import "./tasks/faucet";
import "./tasks/balance";

// require("dotenv").config();

// const ACCOUNT_1 = process.env.ACCOUNT_1 || "hello";
// const ACCOUNT_2 = process.env.ACCOUNT_2 || "hello2";

module.exports = {
  solidity: {
    version: "0.8.0",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
