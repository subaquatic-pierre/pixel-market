import React from "react";
import Container from "@mui/material/Container";

import AuthorRequestList from "components/AuthorRequestList";

const AuthorRequestListPage = () => {
  return (
    <Container maxWidth="md">
      <AuthorRequestList />
    </Container>
  );
};

export default AuthorRequestListPage;
