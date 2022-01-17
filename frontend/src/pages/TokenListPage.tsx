import React from "react";

import Container from "@mui/material/Container";

import TokensList from "components/TokensList";

const TokenListPage = () => {
  return (
    <Container maxWidth="lg">
      <TokensList />
    </Container>
  );
};

export default TokenListPage;
