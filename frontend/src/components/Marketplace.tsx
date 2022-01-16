import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MarketplaceListItem from "components/MarketplaceListItem";
import useDappContext from "hooks/useDappContext";

const Marketplace: React.FC = () => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null }],
  });
  const [dappState, _] = useDappContext();

  const getMarketPlaceItems = async () => {
    // Get contracts from dapp state
    const NFTContract = dappState.contracts.pixelNFT;
    const marketContract = dappState.contracts.pixelMarketplace;
    const tokenIdToUri = [];

    // Get array of Ids from marketplace contract
    const bigNumTokenIds = await marketContract.getAllListingTokenIds();

    // Get token from marketplace
    for (let i = 1; i <= bigNumTokenIds.length; i++) {
      // const num = Number(bigNumTokenIds[i].toString());
      // tokenIds.push(num);
      try {
        // Get token Id from array
        const tokenId = bigNumTokenIds[i].toString();

        // Get token URI from NFT contract
        const tokenUri = await NFTContract.tokenURI(tokenId);
        const item = { tokenId, tokenUri };

        console.log(item);
      } catch {
        continue;
      }
    }

    // Get token URI from NFT contract
    // Loop over Ids to get token Uri, set state list items
    for (let i = 0; i < bigNumTokenIds.length; i++) {
      const tokenId = tokenIds[i];
      console.log(item);
    }

    // console.log(tokenIds);
  };

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
      getMarketPlaceItems();
    }
  }, [dappState]);

  return (
    <Box>
      <Grid container spacing={4}>
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
