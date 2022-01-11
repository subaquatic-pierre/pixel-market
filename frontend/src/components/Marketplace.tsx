import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import listings from "fixtures/listings";

import MarketplaceListItem from "components/MarketplaceListItem";
import MarketplaceItemSkeleton from "components/MarketplaceListItemSkeleton";
import useDappContext from "hooks/useDappContext";

const item = {
  id: 1,
  url: "hhtp://localhost:3000",
  name: "Allison",
  description:
    "consectetur eu sint sunt enim ut consectetur aliqua sint ut anim culpa elit ipsum cillum",
  value: 6,
  dateCreated: "2021-03-27T14:20:55.575Z",
};

const Marketplace: React.FC = () => {
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
        {state.loading &&
          Array(6)
            .fill(item)
            .map((listItem, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                {state.loading ? (
                  <MarketplaceItemSkeleton />
                ) : (
                  <MarketplaceListItem listItem={listItem} />
                )}
              </Grid>
            ))}
        {!state.loading &&
          state.listItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <MarketplaceListItem listItem={item} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
