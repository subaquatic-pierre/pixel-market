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
        tokenInfo: ITokenInfo;
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
  const { id: tokenId } = useParams();
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

  const getTokenAuthor = async (tokenId: string) => {
    const NFTContract = dappState.contracts.pixelNFT;
    const author = await NFTContract.ownerOf(tokenId);
    return author;
  };

  const getTokenMeta = async (tokenUri: string): Promise<ITokenMeta> => {
    const itemMetaRes = await axios.get(tokenUri);
    const tokenMeta = {
      name: itemMetaRes.data.name,
      imageUri: itemMetaRes.data.imageUri,
      description: itemMetaRes.data.description,
      dateCreated: "somedate",
    };
    return tokenMeta;
  };

  const getTokenInfo = async (tokenUri: string): Promise<ITokenInfo> => {
    try {
      const author: string = await getTokenAuthor(tokenId);
      const tokenMeta: ITokenMeta = await getTokenMeta(tokenUri);
      const tokenInfo: ITokenInfo = {
        tokenId,
        author,
        tokenMeta,
      };
      return tokenInfo;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getListingInfo = async (): Promise<IListingInfo> => {
    const marketContract = dappState.contracts.pixelMarketplace;

    try {
      const listingInfoRes = await marketContract.listings(tokenId);

      const listingInfo: IListingInfo = {
        listingId: tokenId,
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

    const tokenInfo: ITokenInfo = await getTokenInfo(tokenUri);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      marketplaceItem: { tokenInfo, listingInfo },
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
          tokenInfo={state.marketplaceItem.tokenInfo}
          listingInfo={state.marketplaceItem.listingInfo}
        />
      )}
    </Container>
  );
};

export default MarketplaceItemPage;
