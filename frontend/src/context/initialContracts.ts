import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import BallotArtifact from "contracts/Ballot.json";
import TokenArtifact from "contracts/Token.json";
import tokenAddress from "contracts/token-contract-address.json";
import ballotAddress from "contracts/ballot-contract-address.json";

export const buildContracts = (provider) => {
  const ballotContract = new ethers.Contract(
    ballotAddress.Ballot,
    BallotArtifact.abi,
    provider.getSigner(0)
  );

  const tokenContract = new ethers.Contract(
    tokenAddress.Token,
    TokenArtifact.abi,
    provider.getSigner(0)
  );

  return {
    ballotContract,
    tokenContract,
  };
};
