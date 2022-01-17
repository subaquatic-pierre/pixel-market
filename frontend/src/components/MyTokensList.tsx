import React from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreateIcon from "@mui/icons-material/Create";
import Button from "@mui/material/Button";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import MyTokenListItem from "components/MyTokenListItem";
import useDappContext from "hooks/useDappContext";

const MyTokensList = () => {
  const [state, setState] = React.useState({
    loading: true,
    listItems: [{ tokenId: null, tokenUri: null }],
  });
  const [dappState, _] = useDappContext();

  const getListItems = async () => {
    const currentWalletAddress = dappState.currentAccount;
    const contract = dappState.contracts.pixelNFT;
    const bigNumTotalSupply = await contract.balanceOf(currentWalletAddress);
    const totalSupply = Number(bigNumTotalSupply.toString());
    const tokenIdToUri = [];
    const tokenIds = [];

    // Loop over total supply to get token Ids
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(
        currentWalletAddress,
        i
      );
      tokenIds.push(tokenId.toString());
    }

    // Loop over Ids to get token Uri, set state list items
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      const tokenUri = await contract.tokenURI(tokenId);
      const item = { tokenId, tokenUri };
      tokenIdToUri.push(item);
    }
    setState({ loading: false, listItems: tokenIdToUri });
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      getListItems();
    }
  }, [dappState]);

  return (
    <Box>
      <Grid item>
        <Toolbar disableGutters sx={{ mb: 1 }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/create"
          >
            <Button variant="contained" sx={{ mr: 2 }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="New Token" />
            </Button>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="create-token"
          >
            <Button variant="contained" sx={{ mr: 2 }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </Button>
          </Link>
        </Toolbar>
      </Grid>
      <Grid container spacing={4}>
        {!state.loading &&
          state.listItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <MyTokenListItem listItem={item} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default MyTokensList;
