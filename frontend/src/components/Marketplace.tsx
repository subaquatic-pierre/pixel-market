import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import MarketplaceListItem from "components/MarketplaceListItem";
import useDappContext from "hooks/useDappContext";

interface IMarketPlaceProps {
  myListings: IListingInfo[];
}

interface IMarketplaceState {
  loading: boolean;
  marketplaceItems: IMarketplaceItem[];
}

const initialMarketplaceState = {
  loading: true,
  marketplaceItems: [],
};

const Marketplace: React.FC<IMarketPlaceProps> = ({ myListings }) => {
  const [state, setState] = React.useState<IMarketplaceState>(
    initialMarketplaceState
  );
  const [dappState, _] = useDappContext();

  const getListingInfo = async (listingId: number): Promise<IListingInfo> => {
    const marketContract = dappState.contracts.pixelMarketplace;

    const listingInfoRes = await marketContract.listings(listingId);

    const listingInfo: IListingInfo = {
      listingId: listingInfoRes.id.toString(),
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
    for (let i = 0; i < listingIds.length; i++) {
      const listingId = listingIds[i];
      const listingInfo = await getListingInfo(listingId);
      listingInfoList.push(listingInfo);
    }
    return listingInfoList;
  };

  const buildListingData = async (
    availableListings: IListingInfo[]
  ): Promise<IMarketplaceItem[]> => {
    const NFTContract = dappState.contracts.pixelNFT;
    const marketplaceItems: IMarketplaceItem[] = [];

    for (let i = 0; i < availableListings.length; i++) {
      const listingInfo = availableListings[i];
      const tokenId = listingInfo.tokenId;
      const tokenUri = await NFTContract.tokenURI(tokenId);
      const itemData = { tokenId, tokenUri, listingInfo };
      marketplaceItems.push(itemData);
    }
    return marketplaceItems;
  };

  const getMarketPlaceItems = async () => {
    const marketContract = dappState.contracts.pixelMarketplace;

    // Get array of Ids from marketplace contract
    // TODO: Add pagination option here, also update contract to take range of ID queries
    const bigNumListingId = await marketContract.getAllListingIds();
    const listingIds = bigNumListingId.map((bigNum) => bigNum.toString());

    const allListings = await buildListingInfoList(listingIds);

    const availableListings = allListings.filter(
      (listing) => listing.status === 0
    );

    const marketplaceData = await buildListingData(availableListings);
    setState({ loading: false, marketplaceItems: marketplaceData });
  };

  const checkIsMyListing = (marketplaceItem: IMarketplaceItem): boolean => {
    if (
      dappState.currentAccount ===
      marketplaceItem.listingInfo.author.toLowerCase()
    ) {
      return true;
    } else {
      return false;
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
          state.marketplaceItems.map((item, index) => (
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
