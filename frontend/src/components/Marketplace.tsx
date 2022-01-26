import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MarketplaceListItem from "components/MarketplaceListItem";
import useDappContext from "hooks/useDappContext";

interface IMaketPlaceProps {
  myListings: any[];
}

const Marketplace: React.FC<IMaketPlaceProps> = ({ myListings }) => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null, listingInfo: null }],
  });
  const [dappState, _] = useDappContext();

  const getMarketPlaceItems = async () => {
    // Get contracts from dapp state
    const NFTContract = dappState.contracts.pixelNFT;
    const marketContract = dappState.contracts.pixelMarketplace;
    const tokenIdToUri = [];

    // Get array of Ids from marketplace contract
    const bigNumListingId = await marketContract.getAllAvailableListingIds();

    // Get token from marketplace
    for (let i = 1; i <= bigNumListingId.length; i++) {
      try {
        // Get token Id from array
        const listingId = bigNumListingId[i].toString();

        // Get token URI from NFT contract
        if (listingId !== "0") {
          const listingInfo = await marketContract.listings(listingId);
          const tokenId = await marketContract.listingIdToTokenId(listingId);
          const tokenUri = await NFTContract.tokenURI(tokenId);
          const item = { tokenId, tokenUri, listingInfo };
          tokenIdToUri.push(item);
        }
      } catch {
        continue;
      }

      setState((oldState) => ({
        ...oldState,
        loading: false,
        listItems: tokenIdToUri,
      }));
    }
  };

  const checkIsMyListing = (item: any) => {
    let listingInfo = null;

    myListings.forEach((listing) => {
      if (item.tokenId === listing.tokenId && listing.status !== 2) {
        listingInfo = listing;
      }
    });

    return listingInfo;
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
              <MarketplaceListItem
                listItem={item}
                isMyListing={checkIsMyListing(item)}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
