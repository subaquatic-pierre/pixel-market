import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MarketplaceListItem from "components/MarketplaceListItem";
import useDappContext from "hooks/useDappContext";
import checkIfMyListing from "utils/checkIfMyListing";
import { emptyAddress } from "const";

interface IMaketPlaceProps {
  myListings: IListingInfo[];
}

const Marketplace: React.FC<IMaketPlaceProps> = ({ myListings }) => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null, listingInfo: null }],
  });
  const [dappState, _] = useDappContext();

  const checkFirstListingExists = async (listingIds: number[]) => {
    const marketContract = dappState.contracts.pixelMarketplace;
    try {
      const listingId = listingIds[0];
      const listingInfoRes = await marketContract.listings(listingId);
      if (listingInfoRes.author === emptyAddress) return false;
    } catch (err) {
      return;
    }
  };

  const getListingInfo = async (listingId: number): Promise<IListingInfo> => {
    const marketContract = dappState.contracts.pixelMarketplace;

    const listingInfoRes = await marketContract.listings(listingId);

    const listingInfo: IListingInfo = {
      listingId: listingInfoRes.listingId,
      author: listingInfoRes.author,
      status: listingInfoRes.status,
      tokenId: listingInfoRes.tokenId.toString(),
      value: listingInfoRes.value.toString(),
    };

    return listingInfo;
  };

  const buildListingInfoList = async (
    listingIds: number[]
  ): Promise<IListingInfo[]> => {
    const listingInfoList: IListingInfo[] = [];
    listingIds.forEach(async (listingId) => {
      const listingInfo = await getListingInfo(listingId);
      listingInfoList.push(listingInfo);
    });
    return listingInfoList;
  };

  const getMarketPlaceItems = async () => {
    const marketContract = dappState.contracts.pixelMarketplace;

    // Get array of Ids from marketplace contract
    const bigNumListingId = await marketContract.getAllListingIds();
    const listingIds = bigNumListingId.map((bigNum) => bigNum.toString());

    const firstListingExists = await checkFirstListingExists(listingIds);
    if (!firstListingExists) return;

    const allListings = await buildListingInfoList(listingIds);
    console.log(allListings);

    // Get token from marketplace
    // for (let i = 0; i < bigNumListingId.length; i++) {
    //   try {
    //     // Get token Id from array
    //     const listingId = bigNumListingId[i].toString();

    //     // Get token URI from NFT contract
    //     const listingInfoRes = await marketContract.listings(listingId);

    //     const listingInfo = {
    //       listingId: listingId,
    //       author: listingInfoRes.author,
    //       status: listingInfoRes.status,
    //       tokenId: listingInfoRes.tokenId.toString(),
    //       value: listingInfoRes.value.toString(),
    //     };

    //     // Get token Id
    //     const bigNumTokenId = await marketContract.listingIdToTokenId(
    //       listingId
    //     );
    //     const tokenId = bigNumTokenId.toString();

    //     // Get token URI
    //     const tokenUri = await NFTContract.tokenURI(tokenId);

    //     // Set item data
    //     const itemData = { tokenId, tokenUri, listingInfo };
    //     listingData.push(itemData);
    //   } catch {
    //     continue;
    //   }

    //   setState((oldState) => ({
    //     ...oldState,
    //     loading: false,
    //     listItems: listingData,
    //   }));
    // }
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
