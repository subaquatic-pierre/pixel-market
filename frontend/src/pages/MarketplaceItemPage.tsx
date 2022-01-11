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
  const [loading, setLoading] = React.useState(true);
  const [tokenUri, setTokenUri] = React.useState("");
  const [item, setItem] = React.useState<any>();
  const [dappState, _] = useDappContext();
  const [pixelNFTContract, setPixelNFTContract] = React.useState<any>();

  // const item = listings.filter((item) => item.id === Number(id))[0];

  const getTokenUri = () => {
    dappState.contracts.pixelNFT
      .tokenURI(id)
      .then((res) => {
        setTokenUri(res.toString());
      })
      .catch((err) => console.log(err));
  };

  const loadItem = () => {
    getTokenMeta(id);
  };

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
        setItem(itemRes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  // Set loading state true until request from blockchain is complete
  React.useEffect(() => {
    loadItem();
    console.log(tokenUri);
  }, [tokenUri]);

  React.useEffect(() => {
    loadItem();
    if (dappState.isInitialized) {
      setPixelNFTContract(dappState.contracts.pixelNFT);
      getTokenUri();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {loading ? <MarketplaceItemSkeleton /> : <MarketplaceItem item={item} />}
    </Container>
  );
};

export default MarketplaceItemPage;
