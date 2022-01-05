import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Skeleton from "@mui/material/Skeleton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";

import BrandLogo from "components/BrandLogo";

interface ISideNavProps {
  mobileOpen: boolean;
  drawerWidth: number;
}

interface INavListProps {
  drawerWidth: number;
}

const NavList: React.FC<INavListProps> = ({ drawerWidth }) => {
  const arr = Array(7).fill("txt");
  return (
    <List color="inherit">
      {arr.map((text, index) => (
        <ListItem key={index} sx={{ my: 0, py: 0 }}>
          <Skeleton width={drawerWidth} height={40} />
        </ListItem>
      ))}
    </List>
  );
};

const SideNavSkeleton: React.FC<ISideNavProps> = ({
  mobileOpen,
  drawerWidth,
}) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => {}}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Box>
          <BrandLogo />
          <NavList drawerWidth={drawerWidth} />
        </Box>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderWidth: 0,
          },
        }}
        open
      >
        <AppBar
          sx={{
            width: drawerWidth,
            height: "100vh",
            right: "auto",
            left: 0,
          }}
          position="fixed"
          color="primary"
          elevation={0}
        >
          <BrandLogo />
          <NavList drawerWidth={drawerWidth} />
        </AppBar>
      </Drawer>
    </Box>
  );
};

export default SideNavSkeleton;
