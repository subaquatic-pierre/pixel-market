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
  const [_n, { setWarning }] = useNotificationContext();
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
      .catch((err) => {
        setWarning(err.message);
      });
  };

  const loadItem = async () => {
    const marketContract = dappState.contracts.pixelMarketplace;

    try {
      // Get metadata from server
      const itemMetaRes = await axios.get(tokenUri);
      const attrs = itemMetaRes.data.attributes;
      const tokenMeta = {
        tokenId: itemMetaRes.data.tokenId,
        imageUrl: itemMetaRes.data.imageUrl,
        name: itemMetaRes.data.name,
        description: itemMetaRes.data.description,
        value: attrs[0].value,
        author: attrs[1].author,
        dateCreated: "somedate",
      };

      // Get listing info from blockChain
      const listingInfoRes = await marketContract.listings(id);

      const listingInfo = {
        listingId: id,
        author: listingInfoRes.author,
        status: listingInfoRes.status,
        tokenId: listingInfoRes.tokenId.toString(),
        value: listingInfoRes.value.toString(),
      };

      setItem({ tokenMeta, listingInfo });
      setLoading(false);
    } catch (err) {
      setWarning(err.message);
      return;
    }
  };

  // Set loading state true until request from blockchain is complete
  React.useEffect(() => {
    if (tokenUri) loadItem();
  }, [tokenUri]);

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getTokenUri();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {loading ? (
        <MarketplaceItemSkeleton />
      ) : (
        <MarketplaceItem
          tokenMeta={item.tokenMeta}
          listingInfo={item.listingInfo}
        />
      )}
    </Container>
  );
};

export default MarketplaceItemPage;
