import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import TokenListItem from "components/TokenListItem";
import TokenListToolbar from "components/TokenListToolbar";
import useDappContext from "hooks/useDappContext";

const TokenList = () => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null }],
  });
  const [dappState, _] = useDappContext();

  const getTokens = async () => {
    const currentWalletAddress = dappState.currentAccount;
    const contract = dappState.contracts.pixelNFT;
    const bigNumTotalSupply = await contract.balanceOf(currentWalletAddress);
    const totalSupply = Number(bigNumTotalSupply.toString());
    const tokenIdToUri = [];
    const tokenIds = [];

    // Loop over total supply to get token Ids
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(
        currentWalletAddress,
        i
      );
      tokenIds.push(tokenId.toString());
    }

    // Loop over Ids to get token Uri, set state list items
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      const tokenUri = await contract.tokenURI(tokenId);
      const item = { tokenId, tokenUri };
      tokenIdToUri.push(item);
    }
    setState({ loading: false, listItems: tokenIdToUri });
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getTokens();
    }
  }, [dappState]);

  return (
    <Box>
      <TokenListToolbar />
      <Grid container spacing={4}>
        {!state.loading &&
          state.listItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <TokenListItem listItem={item} isListing={index % 2 === 0} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default TokenList;
