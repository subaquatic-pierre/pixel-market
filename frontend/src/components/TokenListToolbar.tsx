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

const TokenListToolbar = () => {
  const [authorshipStatus, setAuthorshipStatus] = React.useState({
    isAuthor: false,
    loading: true,
  });
  const [dappState, _] = useDappContext();

  const checkAuthorshipStatus = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const isAuthor = await marketplaceContract.isAuthor(
      dappState.currentAccount
    );

    if (isAuthor) {
      setAuthorshipStatus({
        isAuthor: true,
        loading: false,
      });
      return;
    }

    setAuthorshipStatus((oldStatus) => ({ ...oldStatus, loading: false }));
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      checkAuthorshipStatus();
    }
  }, [dappState]);

  return (
    <Grid item>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/create">
          <Button variant="contained" sx={{ mr: 2 }}>
            <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="New Token" />
          </Button>
        </Link>
        {!authorshipStatus.loading && !authorshipStatus.isAuthor && (
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
