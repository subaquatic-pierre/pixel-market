import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import MarketplaceItem from "components/MarketplaceItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";

import listings from "fixtures/listings";
import { HOST_URL } from "const";

const MarketplaceItemPage = () => {
  const { id } = useParams();
  const [state, setState] = React.useState({
    loading: true,
    item: undefined,
    tokenUri: undefined,
  });
  const [dappState, _] = useDappContext();
  const [pixelNFTContract, setPixelNFTContract] = React.useState<any>();

  // const item = listings.filter((item) => item.id === Number(id))[0];

  const getTokenMeta = (tokenId) => {
    axios
      .get(`${HOST_URL}/token-meta/${tokenId}`)
      .then((res) => {
        const attrs = res.data.attributes;
        const itemRes = {
          id: res.data.tokenId,
          url: res.data.imageUrl,
          name: res.data.name,
          description: res.data.description,
          value: attrs[0].value,
          dateCreated: "somedate",
        };
        setState((oldState) => ({
          ...oldState,
          loading: false,
          item: itemRes,
        }));
        console.log(itemRes);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  const loadItem = () => {
    getTokenMeta(id);
  };

  // Set loading state true until request from blockchain is complete
  React.useEffect(() => {
    loadItem();
  }, []);

  // React.useEffect(() => {
  //   loadItem();
  //   // if (dappState.isInitialized) {
  //   //   setPixelNFTContract(dappState.contracts.pixelNFT);
  //   // }
  // }, [dappState]);

  return (
    <Container maxWidth="lg">
      {state.loading ? (
        <MarketplaceItemSkeleton />
      ) : (
        <MarketplaceItem item={state.item} />
      )}
    </Container>
  );
};

export default MarketplaceItemPage;
