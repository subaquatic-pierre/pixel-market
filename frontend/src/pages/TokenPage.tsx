import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import TokenItem from "components/TokenItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";
import filterAvailableListings from "utils/filterAvailableListings";

interface ITokenPageState {
  loading: boolean;
  pageError: boolean;
  tokenUri: string;
  tokenMeta: ITokenMeta | undefined;
  listingInfo: IListingInfo | undefined;
}

const initialMarketplaceItemPageState: ITokenPageState = {
  loading: true,
  pageError: false,
  tokenUri: "",
  tokenMeta: undefined,
  listingInfo: undefined,
};

const TokenPage = () => {
  const [state, setState] = React.useState<ITokenPageState>(
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

  const getTokenUri = async (_tokenId: string): Promise<string> => {
    const NFTContract = dappState.contracts.pixelNFT;

    try {
      const tokenUri = await NFTContract.tokenURI(_tokenId);
      return tokenUri;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getMetadata = async (_tokenUri: string): Promise<ITokenMeta> => {
    try {
      const itemMetaRes = await axios.get(_tokenUri);
      const attrs = itemMetaRes.data.attributes;
      const tokenMeta: ITokenMeta = {
        tokenId: itemMetaRes.data.tokenId,
        imageUrl: itemMetaRes.data.imageUrl,
        name: itemMetaRes.data.name,
        description: itemMetaRes.data.description,
        author: attrs[1].author,
        dateCreated: "somedate",
      };
      return tokenMeta;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getListingInfo = async (_tokenId: string) => {
    let listingInfo: IListingInfo | undefined = undefined;
    const { myListings } = dappState;
    const availableListings = await filterAvailableListings(
      myListings,
      dappState
    );
    listingInfo = availableListings.filter(
      (listing) => listing.tokenId === _tokenId
    )[0];
    console.log(listingInfo);
    return listingInfo;
  };

  const loadItem = async () => {
    const tokenUri = await getTokenUri(tokenId);

    const tokenMeta: ITokenMeta = await getMetadata(tokenUri);
    const listingInfo: IListingInfo | undefined = await getListingInfo(tokenId);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      tokenMeta,
      listingInfo,
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
        <TokenItem
          tokenMeta={state.tokenMeta}
          listingInfo={state.listingInfo}
          tokenId={tokenId}
          isListing={state.listingInfo !== undefined}
        />
      )}
    </Container>
  );
};

export default TokenPage;
