const fs = require("fs");

task("balance", "Get balance of address")
  .addPositionalParam(
    "userAddress",
    "The address that you wish to check balance of"
  )
  .setAction(async ({ userAddress }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/token-contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("Token", address.Token);

    console.log(userAddress);
    const balance = await token.balanceOf(userAddress);

    console.log(balance.toNumber());
  });
