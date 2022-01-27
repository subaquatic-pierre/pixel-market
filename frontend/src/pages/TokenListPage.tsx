import React from "react";

import Container from "@mui/material/Container";

import TokensList from "components/TokensList";
import useDappContext from "hooks/useDappContext";

interface ITokenListPageState {
  myListings: IListingInfo[];
  listingsLoaded: boolean;
}

const initialTokenListPageState: ITokenListPageState = {
  myListings: [],
  listingsLoaded: false,
};

const TokenListPage = () => {
  const [state, setState] = React.useState<ITokenListPageState>(
    initialTokenListPageState
  );
  const [dappState, _] = useDappContext();

  const getMyListings = async () => {
    const marketContract = dappState.contracts.pixelMarketplace;
    const listingIds: string[] = [];
    const listings: IListingInfo[] = [];

    // Get array of Ids from marketplace contract
    const bigNumTokenIds = await marketContract.getMyListingsIds();

    for (let i = 0; i < bigNumTokenIds.length; i++) {
      const tokenId = bigNumTokenIds[i].toString();
      listingIds.push(tokenId);
    }

    listingIds.forEach(async (listingId) => {
      const listingRes = await marketContract.listings(listingId);
      const listing: IListingInfo = {
        listingId: listingId,
        author: listingRes.author,
        status: listingRes.status,
        tokenId: listingRes.tokenId.toString(),
        value: listingRes.value.toString(),
      };
      listings.push(listing);
    });
    setState({ myListings: listings, listingsLoaded: true });
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getMyListings();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {state.listingsLoaded && <TokensList myListings={state.myListings} />}
    </Container>
  );
};

export default TokenListPage;
