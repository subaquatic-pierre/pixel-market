import React from "react";

import Container from "@mui/material/Container";

import Marketplace from "components/Marketplace";

import useDappContext from "hooks/useDappContext";

const MarketPlacePage = () => {
  const [myListings, setMyListings] = React.useState<any>([]);
  const [myListingsLoaded, setMyListingsLoaded] =
    React.useState<boolean>(false);
  const [dappState, _] = useDappContext();

  const getMyListings = async () => {
    try {
      const marketContract = dappState.contracts.pixelMarketplace;
      const listingIds = [];
      const listings = [];

      // Get array of Ids from marketplace contract
      const bigNumTokenIds = await marketContract.getMyListingsIds();

      // Get token from marketplace
      for (let i = 0; i < bigNumTokenIds.length; i++) {
        try {
          // Get token Id from array
          const tokenId = bigNumTokenIds[i].toString();
          if (tokenId !== "0") listingIds.push(tokenId);
        } catch {
          continue;
        }
      }

      listingIds.forEach(async (listingId) => {
        const listingRes = await marketContract.listings(listingId);
        const listing = {
          listingId: listingId,
          author: listingRes.author,
          status: listingRes.status,
          tokenId: listingRes.tokenId.toString(),
          value: listingRes.value.toString(),
        };
        listings.push(listing);
      });

      setMyListings((oldState) => {
        setMyListingsLoaded(true);
        return listings;
      });
    } catch (err) {
      return;
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getMyListings();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {myListingsLoaded && <Marketplace myListings={myListings} />}
    </Container>
  );
};

export default MarketPlacePage;
