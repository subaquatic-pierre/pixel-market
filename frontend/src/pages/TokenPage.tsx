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
  tokenInfo: ITokenInfo | undefined;
  listingInfo: IListingInfo | undefined;
}

const initialMarketplaceItemPageState: ITokenPageState = {
  loading: true,
  pageError: false,
  tokenUri: "",
  tokenInfo: undefined,
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

  const getTokenMeta = async (_tokenUri: string): Promise<ITokenMeta> => {
    try {
      const itemMetaRes = await axios.get(_tokenUri);
      console.log(itemMetaRes);
      const tokenMeta: ITokenMeta = {
        imageUri: itemMetaRes.data.imageUri,
        name: itemMetaRes.data.name,
        description: itemMetaRes.data.description,
        dateCreated: "somedate",
      };
      return tokenMeta;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const getTokenAuthor = async (tokenId: string) => {
    const NFTContract = dappState.contracts.pixelNFT;
    const author = await NFTContract.ownerOf(tokenId);
    return author;
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
    return listingInfo;
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

  const loadItem = async () => {
    const tokenUri = await getTokenUri(tokenId);

    const tokenInfo: ITokenInfo = await getTokenInfo(tokenUri);
    const listingInfo: IListingInfo | undefined = await getListingInfo(tokenId);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      tokenInfo,
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
          tokenInfo={state.tokenInfo}
          listingInfo={state.listingInfo}
          tokenId={tokenId}
          isListing={state.listingInfo !== undefined}
        />
      )}
    </Container>
  );
};

export default TokenPage;
