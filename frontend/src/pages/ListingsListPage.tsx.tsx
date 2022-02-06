import React from "react";
import Container from "@mui/material/Container";

import ListingsList from "components/ListingsList";

const ListingsListPage = () => {
  return (
    <Container maxWidth="lg">
      <ListingsList />
    </Container>
  );
};

export default ListingsListPage;
