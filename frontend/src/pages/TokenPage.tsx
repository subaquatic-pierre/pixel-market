import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import TokenItem from "components/TokenItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";

interface ITokenPageState {
  loading: boolean;
  pageError: boolean;
  tokenUri: string;
  tokenMeta: ITokenMeta | undefined;
}

const initialMarketplaceItemPageState: ITokenPageState = {
  loading: true,
  pageError: false,
  tokenUri: "",
  tokenMeta: undefined,
};

const TokenPage = () => {
  const [state, setState] = React.useState<ITokenPageState>(
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
        value: attrs[0].value,
        author: attrs[1].author,
        dateCreated: "somedate",
      };
      return tokenMeta;
    } catch (err) {
      setPageError(err.message);
    }
  };

  const loadItem = async () => {
    const tokenUri = await getTokenUri(id);

    const tokenMeta: ITokenMeta = await getMetadata(tokenUri);

    setState((oldState) => ({
      ...oldState,
      loading: false,
      tokenMeta,
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
        <TokenItem tokenMeta={state.tokenMeta} />
      )}
    </Container>
  );
};

export default TokenPage;
