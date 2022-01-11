import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import MarketplaceItem from "components/MarketplaceItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";

const MarketplaceItemPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [tokenUri, setTokenUri] = React.useState("");
  const [item, setItem] = React.useState<any>();
  const [dappState, _] = useDappContext();

  const getTokenUri = () => {
    const contract = dappState.contracts.pixelNFT;
    contract
      .tokenURI(id)
      .then((res) => {
        setTokenUri(res.toString());
      })
      .catch((err) => console.log(err));
  };

  const loadItem = () => {
    axios
      .get(tokenUri)
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
  }, [tokenUri]);

  React.useEffect(() => {
    if (dappState.isInitialized) {
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
