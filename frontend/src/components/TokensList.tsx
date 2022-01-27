import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import TokenListItem from "components/TokenListItem";
import TokenListToolbar from "components/TokenListToolbar";
import useDappContext from "hooks/useDappContext";
import checkIfMyListing from "utils/checkIfMyListing";

interface ITokenListProps {
  myListings: IListingInfo[];
}

const TokenList: React.FC<ITokenListProps> = ({ myListings }) => {
  const [state, setState] = React.useState({
    loading: true,
    tokens: [],
  });
  const [dappState, _] = useDappContext();

  const getUserTokenSupply = async (): Promise<number> => {
    // Get current user and contract
    const currentWalletAddress = dappState.currentAccount;
    const NFTContract = dappState.contracts.pixelNFT;

    // Query for user token supply
    const bigNumUserTotalSupply = await NFTContract.balanceOf(
      currentWalletAddress
    );
    const userTotalSupply = Number(bigNumUserTotalSupply.toString());
    return userTotalSupply;
  };

  const getTokenIds = async (userTotalSupply: number): Promise<number[]> => {
    // Get current user and contract
    const currentWalletAddress = dappState.currentAccount;
    const NFTContract = dappState.contracts.pixelNFT;

    const tokenIds: number[] = [];

    // Loop over user total supply to get token Ids
    for (let i = 0; i < userTotalSupply; i++) {
      const tokenId = await NFTContract.tokenOfOwnerByIndex(
        currentWalletAddress,
        i
      );
      tokenIds.push(tokenId.toString());
    }
    return tokenIds;
  };

  const buildTokenIdToUriMapList = async (
    tokenIds: number[]
  ): Promise<ITokenIdToUriMap[]> => {
    const NFTContract = dappState.contracts.pixelNFT;
    const tokenIdToUri = [];

    // Loop over Ids to get token Uri, set state list items
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      const tokenUri = await NFTContract.tokenURI(tokenId);
      const item = { tokenId, tokenUri };
      tokenIdToUri.push(item);
    }

    return tokenIdToUri;
  };

  const getTokens = async () => {
    const userTotalSupply = await getUserTokenSupply();

    const tokenIdList = await getTokenIds(userTotalSupply);

    const tokenIdToUriMapList = await buildTokenIdToUriMapList(tokenIdList);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      tokens: tokenIdToUriMapList,
    }));
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getTokens();
    }
    console.log(myListings);
  }, [dappState]);

  return (
    <Box>
      <TokenListToolbar />
      <Grid container spacing={4}>
        {!state.loading &&
          state.tokens.map((token, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <TokenListItem
                token={token}
                listingInfo={checkIfMyListing(token.tokenId, myListings)}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default TokenList;
