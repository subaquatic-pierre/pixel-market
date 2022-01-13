import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MyTokenListItem from "components/MyTokenListItem";
import useDappContext from "hooks/useDappContext";

const MyTokensList = () => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null }],
  });
  const [dappState, _] = useDappContext();

  const getListItems = async () => {
    const contract = dappState.contracts.pixelNFT;
    const bigNumTotalSupply = await contract.totalSupply();
    const totalSupply = Number(bigNumTotalSupply.toString());
    const tokenIdToUri = [];
    const tokenIds = [];

    // Loop over total supply to get token Ids
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenByIndex(i);
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
      getListItems();
    }
  }, [dappState]);

  return (
    <Box>
      <Grid container spacing={4}>
        {!state.loading &&
          state.listItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <MyTokenListItem listItem={item} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default MyTokensList;
