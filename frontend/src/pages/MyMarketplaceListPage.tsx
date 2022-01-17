import React from "react";
import Container from "@mui/material/Container";

import MyMarketplaceListings from "components/MyListingsList";

const MyMarketplaceListPage = () => {
  return (
    <Container maxWidth="lg">
      <MyMarketplaceListings />
    </Container>
  );
};

export default MyMarketplaceListPage;
