import React from "react";
import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";

import RequestAuthorship from "components/RequestAuthorship";

const MyMarketplaceListPage = () => {
  const [{ isInitialized }, _] = useDappContext();

  return (
    <Container maxWidth="lg">
      <RequestAuthorship />
    </Container>
  );
};

export default MyMarketplaceListPage;
