import React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import MarketplaceItem from "components/MarketplaceItem";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";

import listings from "fixtures/listings";

const MarketplaceItemPage = () => {
  const { id } = useParams();
  const [state, setState] = React.useState({ loading: true });
  const item = listings.filter((item) => item.id === Number(id))[0];

  const loadItem = () => {
    setTimeout(() => {
      setState({ loading: false });
    }, 500);
  };

  // Set loading state true until request from blockchain is complete
  React.useEffect(() => {
    loadItem();
  }, []);

  return (
    <Box>
      {state.loading ? (
        <MarketplaceItemSkeleton />
      ) : (
        <MarketplaceItem item={item} />
      )}
    </Box>
  );
};

export default MarketplaceItemPage;
