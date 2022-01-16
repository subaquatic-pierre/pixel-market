import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MyListingsListItem from "components/MyListingsListItem";
import useDappContext from "hooks/useDappContext";

const MyListingsList = () => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null }],
  });
  const [dappState, _] = useDappContext();

  const getMyListings = async () => {
    // Get contracts from dapp state
    const NFTContract = dappState.contracts.pixelNFT;
    const marketContract = dappState.contracts.pixelMarketplace;
    const tokenIdToUri = [];

    // Get array of Ids from marketplace contract
    const bigNumTokenIds = await marketContract.getMyListingsIds();

    // Get token from marketplace
    for (let i = 1; i <= bigNumTokenIds.length; i++) {
      try {
        // Get token Id from array
        const tokenId = bigNumTokenIds[i].toString();

        // Get token URI from NFT contract
        const tokenUri = await NFTContract.tokenURI(tokenId);
        const item = { tokenId, tokenUri };

        tokenIdToUri.push(item);
      } catch {
        continue;
      }

      setState({ loading: false, listItems: tokenIdToUri });
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getMyListings();
    }
  }, [dappState]);

  return (
    <Box>
      <Grid container spacing={4}>
        {!state.loading &&
          state.listItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <MyListingsListItem listItem={item} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default MyListingsList;
