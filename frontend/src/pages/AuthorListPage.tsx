import React from "react";
import Container from "@mui/material/Container";

import AuthorList from "components/AuthorList";

const AuthorRequestListPage = () => {
  return (
    <Container maxWidth="lg">
      <AuthorList />
    </Container>
  );
};

export default AuthorRequestListPage;
