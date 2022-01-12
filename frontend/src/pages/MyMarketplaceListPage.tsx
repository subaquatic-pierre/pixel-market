import React from "react";
import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";

import RequestAuthorship from "components/RequestAuthorship";
import MyMarketplaceListings from "components/MyMarketplaceListings";

const MyMarketplaceListPage = () => {
  const [authorshipStatus, setAuthorshipStatus] = React.useState({
    isAuthor: false,
    requestSent: false,
    loading: true,
  });
  const [dappState, _] = useDappContext();

  const checkAuthorshipStatus = async () => {
    const contract = dappState.contracts.pixelMarketplace;
    const isAuthor = await contract.isAuthor();
    const isRequestSent = await contract.isAuthorRequestSent();

    if (isRequestSent) {
      setAuthorshipStatus({
        isAuthor: false,
        requestSent: true,
        loading: false,
      });
      return;
    }

    if (isAuthor) {
      setAuthorshipStatus({
        isAuthor: true,
        requestSent: false,
        loading: false,
      });
      return;
    }

    setAuthorshipStatus((oldStatus) => ({ ...oldStatus, loading: false }));
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      checkAuthorshipStatus();
    }
  }, [dappState]);

  return (
    <Container maxWidth="lg">
      {authorshipStatus.loading ? (
        <>loadings</>
      ) : authorshipStatus.isAuthor ? (
        <MyMarketplaceListings />
      ) : (
        <RequestAuthorship requestSent={authorshipStatus.requestSent} />
      )}
    </Container>
  );
};

export default MyMarketplaceListPage;
