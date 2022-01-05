import React from "react";
import Box from "@mui/material/Box";

import Dashboard from "components/Dashboard";
const DashboardPage: React.FC = ({ children }) => {
  return (
    <Box>
      <Dashboard />
    </Box>
  );
};

export default DashboardPage;
