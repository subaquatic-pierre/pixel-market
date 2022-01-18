import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import TokenListItem from "components/TokenListItem";
import TokenListToolbar from "components/TokenListToolbar";
import useDappContext from "hooks/useDappContext";

const TokenList = () => {
  const [state, setState] = React.useState({
    loading: true,
    tokens: [{ tokenId: null, tokenUri: null }],
    listings: [],
  });
  const [listingIds, setListingIds] = React.useState<string[]>([]);
  const [dappState, _] = useDappContext();

  const getListings = async () => {
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
    setState((oldState) => ({ ...oldState, listings }));
  };

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

    setState((oldState) => ({
      ...oldState,
      loading: false,
      tokens: tokenIdToUri,
    }));
  };

  const checkIfListing = (tokenId: string) => {
    let _listingInfo = null;
    const _listings = state.listings;
    console.log(_listings);
    _listings.forEach((listing) => {
      if (tokenId === listing.tokenId && listing.status !== 2) {
        _listingInfo = listing;
      }
    });
    return _listingInfo;
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getTokens();
      getListings();
    }
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
                listingInfo={checkIfListing(token.tokenId)}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default TokenList;
