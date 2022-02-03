import React from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import SideNav from "components/SideNav";
import TopNav from "components/TopNav";
import Footer from "components/Footer";

import AlertMessage from "components/AlertMessage";

const drawerWidth = 240;

const Layout: React.FC = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopNav
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <SideNav
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />

      <Box
        sx={{
          py: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: `100vh`,
          backgroundColor: theme.palette.secondary.light,
        }}
      >
        <Toolbar />
        <AlertMessage />
        <Box sx={{ minHeight: "90vh" }} component="main">
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
