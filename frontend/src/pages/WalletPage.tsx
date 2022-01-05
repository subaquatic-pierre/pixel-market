import React from "react";
import Box from "@mui/material/Box";

import Wallet from "components/Wallet";

const DashboardPage: React.FC = ({ children }) => {
  return (
    <Box>
      <Wallet />
    </Box>
  );
};

export default DashboardPage;
