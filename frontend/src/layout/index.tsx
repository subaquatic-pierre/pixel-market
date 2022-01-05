import React from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

import SideNav from "components/SideNav";
import TopNav from "components/TopNav";
import TopNavSkeleton from "components/TopNavSkeleton";
import SideNavSkeleton from "components/SideNavSkeleton";
import MainSkeleton from "components/MainSkeleton";

import AlertMessage from "components/AlertMessage";
import useDappContext from "hooks/useDappContext";

const drawerWidth = 240;

const Layout: React.FC = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [{ isInitialized }, _] = useDappContext();
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
        <Container component="main" maxWidth="xl">
          {isInitialized ? children : <MainSkeleton />}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
