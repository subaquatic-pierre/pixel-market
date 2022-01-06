import React from "react";
import { useParams } from "react-router-dom";

import Container from "@mui/material/Container";
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
    <Container maxWidth="lg">
      {state.loading ? (
        <MarketplaceItemSkeleton />
      ) : (
        <MarketplaceItem item={item} />
      )}
    </Container>
  );
};

export default MarketplaceItemPage;
