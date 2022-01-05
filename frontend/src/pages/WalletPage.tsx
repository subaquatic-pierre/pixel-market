import React from "react";
import Box from "@mui/material/Box";

import useDappContext from "hooks/useDappContext";

import WalletSkeleton from "components/WalletSkeleton";
import Wallet from "components/Wallet";

const DashboardPage: React.FC = ({ children }) => {
  const [{ isInitialized }, _] = useDappContext();

  return <Box>{isInitialized ? <Wallet /> : <WalletSkeleton />}</Box>;
};

export default DashboardPage;
