import React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import Skeleton from "@mui/material/Skeleton";

interface ITopNavSkeletonProps {
  drawerWidth: number;
}

const TopNavSkeleton: React.FC<ITopNavSkeletonProps> = ({ drawerWidth }) => {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        elevation={0}
        color="transparent"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ ml: "auto", display: { xs: "none", sm: "flex" } }}>
            <Skeleton width={170} height={70} />
            <Skeleton sx={{ ml: 3 }} width={170} height={70} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopNavSkeleton;
