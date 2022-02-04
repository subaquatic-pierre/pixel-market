import React from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreateIcon from "@mui/icons-material/Create";
import Button from "@mui/material/Button";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import useDappContext from "hooks/useDappContext";

interface ITokenListToolbar {
  isAuthor: boolean;
}

const TokenListToolbar: React.FC<ITokenListToolbar> = ({ isAuthor }) => {
  const [dappState, _] = useDappContext();

  return (
    <Grid item>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        {/* <Link style={{ textDecoration: "none", color: "inherit" }} to="/create">
          <Button variant="contained" sx={{ mr: 2 }}>
            <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="New Token" />
          </Button>
        </Link> */}
        {!isAuthor && (
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/register-author"
          >
            <Button variant="contained" sx={{ mr: 2 }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </Button>
          </Link>
        )}
      </Toolbar>
    </Grid>
  );
};

export default TokenListToolbar;
