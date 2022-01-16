import React from "react";

import Container from "@mui/material/Container";

import MyTokensList from "components/MyTokensList";

const MyTokenListPage = () => {
  return (
    <Container maxWidth="lg">
      <MyTokensList />
    </Container>
  );
};

export default MyTokenListPage;
