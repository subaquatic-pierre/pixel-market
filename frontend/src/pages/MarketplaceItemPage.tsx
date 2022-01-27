import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import MarketplaceItem from "components/MarketplaceItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";

interface IMarketplaceItemPageState {
  loading: boolean;
  pageError: boolean;
  tokenUri: string;
  marketplaceItem:
    | {
        tokenMeta: ITokenMeta;
        listingInfo: IListingInfo;
      }
    | undefined;
}

const initialMarketplaceItemPageState: IMarketplaceItemPageState = {
  loading: true,
  pageError: false,
  tokenUri: "",
  marketplaceItem: undefined,
};

const MarketplaceItemPage = () => {
  const [state, setState] = React.useState<IMarketplaceItemPageState>(
    initialMarketplaceItemPageState
  );
  const { id } = useParams();
  const [_n, { setWarning }] = useNotificationContext();
  const [dappState, _] = useDappContext();

  const setPageError = (message: string): void => {
    setState((oldState) => ({
      ...oldState,
      pageError: true,
      loading: false,
    }));
    setWarning(message);
  };

  const getTokenUri = async (tokenId: string): Promise<string> => {
    const NFTContract = dappState.contracts.pixelNFT;

    try {
      const tokenUri = await NFTContract.tokenURI(tokenId);
      return tokenUri;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getMetadata = async (tokenUri: string): Promise<ITokenMeta> => {
    try {
      const itemMetaRes = await axios.get(tokenUri);
      const attrs = itemMetaRes.data.attributes;
      const tokenMeta: ITokenMeta = {
        tokenId: itemMetaRes.data.tokenId,
        imageUrl: itemMetaRes.data.imageUrl,
        name: itemMetaRes.data.name,
        description: itemMetaRes.data.description,
        value: attrs[0].amount,
        author: attrs[1].author,
        dateCreated: "somedate",
      };
      return tokenMeta;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getListingInfo = async (): Promise<IListingInfo> => {
    const marketContract = dappState.contracts.pixelMarketplace;

    try {
      const listingInfoRes = await marketContract.listings(id);

      const listingInfo: IListingInfo = {
        listingId: id,
        author: listingInfoRes.author,
        status: listingInfoRes.status,
        tokenId: listingInfoRes.tokenId.toString(),
        value: listingInfoRes.value.toString(),
      };
      return listingInfo;
    } catch (err) {
      setState((oldState) => ({ ...oldState, pageError: true }));
      setWarning(err.message);
    }
  };

  const loadItem = async () => {
    const listingInfo: IListingInfo = await getListingInfo();

    const tokenUri = await getTokenUri(listingInfo.tokenId);

    const tokenMeta: ITokenMeta = await getMetadata(tokenUri);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      marketplaceItem: { tokenMeta, listingInfo },
    }));
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {state.loading || state.pageError ? (
        <MarketplaceItemSkeleton />
      ) : (
        <MarketplaceItem
          tokenMeta={state.marketplaceItem.tokenMeta}
          listingInfo={state.marketplaceItem.listingInfo}
        />
      )}
    </Container>
  );
};

export default MarketplaceItemPage;
