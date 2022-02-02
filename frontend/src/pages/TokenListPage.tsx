import React from "react";

import Container from "@mui/material/Container";

import TokensList from "components/TokensList";
import useDappContext from "hooks/useDappContext";

const TokenListPage = () => {
  const [dappState, _] = useDappContext();

  return (
    <Container maxWidth="lg">
      {dappState.isInitialized && <TokensList />}
    </Container>
  );
};

export default TokenListPage;
