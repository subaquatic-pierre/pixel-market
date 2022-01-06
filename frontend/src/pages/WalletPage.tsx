import React from "react";
import Container from "@mui/material/Container";

import useDappContext from "hooks/useDappContext";

import WalletSkeleton from "components/WalletSkeleton";
import Wallet from "components/Wallet";

const DashboardPage: React.FC = ({ children }) => {
  const [{ isInitialized }, _] = useDappContext();

  return (
    <Container maxWidth="lg">
      {isInitialized ? <Wallet /> : <WalletSkeleton />}
    </Container>
  );
};

export default DashboardPage;
