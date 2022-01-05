import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";

import BrandLogo from "components/BrandLogo";

import useNavLinks from "hooks/useNavLinks";

interface ISideNavProps {
  mobileOpen: boolean;
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

interface INavListProps {
  handleDrawerToggle?: () => void;
}

const NavList: React.FC<INavListProps> = ({ handleDrawerToggle }) => {
  const links = useNavLinks();
  return (
    <List color="inherit">
      {links.map(({ text, link }, index) => (
        <Link
          key={index}
          style={{ textDecoration: "none", color: "inherit" }}
          to={link}
        >
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemIcon sx={{ color: "inherit" }}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

const SideNav: React.FC<ISideNavProps> = ({
  mobileOpen,
  drawerWidth,
  handleDrawerToggle,
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
        onClose={handleDrawerToggle}
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
          <NavList handleDrawerToggle={handleDrawerToggle} />
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
          <NavList />
        </AppBar>
      </Drawer>
    </Box>
  );
};

export default SideNav;
