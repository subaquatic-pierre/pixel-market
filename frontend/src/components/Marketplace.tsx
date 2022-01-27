import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MarketplaceListItem from "components/MarketplaceListItem";
import useDappContext from "hooks/useDappContext";
import checkIfMyListing from "utils/checkIfMyListing";

interface IMaketPlaceProps {
  myListings: IListingInfo[];
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
    const listingData = [];

    // Get array of Ids from marketplace contract
    const bigNumListingId = await marketContract.getAllAvailableListingIds();

    // Get token from marketplace
    for (let i = 1; i <= bigNumListingId.length; i++) {
      try {
        // Get token Id from array
        const listingId = bigNumListingId[i].toString();

        // Get token URI from NFT contract
        if (listingId !== "0") {
          const listingInfoRes = await marketContract.listings(listingId);

          const listingInfo = {
            listingId: listingId,
            author: listingInfoRes.author,
            status: listingInfoRes.status,
            tokenId: listingInfoRes.tokenId.toString(),
            value: listingInfoRes.value.toString(),
          };

          // Get token Id
          const bigNumTokenId = await marketContract.listingIdToTokenId(
            listingId
          );
          const tokenId = bigNumTokenId.toString();

          // Get token URI
          const tokenUri = await NFTContract.tokenURI(tokenId);

          // Set item data
          const itemData = { tokenId, tokenUri, listingInfo };
          listingData.push(itemData);
        }
      } catch {
        continue;
      }

      setState((oldState) => ({
        ...oldState,
        loading: false,
        listItems: listingData,
      }));
    }
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
                isMyListing={checkIfMyListing(item.tokenId, myListings)}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
