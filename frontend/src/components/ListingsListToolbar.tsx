import React from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DeleteIcon from "@mui/icons-material/Delete";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface IListingsListToolbarProps {
  selected: ISelectedListing[];
}

const ListingsListToolbar: React.FC<IListingsListToolbarProps> = ({
  selected,
}) => {
  const [dappState, _] = useDappContext();
  const [_n, { setSuccess, setWarning }] = useNotificationContext();

  const handleDeleteSelected = async (): Promise<void> => {
    const marketContract = dappState.contracts.pixelMarketplace;
    const availableListings = selected.filter(
      (listing) => listing.status === "Available"
    );

    const availableListingIds = availableListings.map(
      (listing) => listing.listingId
    );

    try {
      const res = await marketContract.removeListings(availableListingIds);
      console.log(res);
      setSuccess("Listings successfully removed");
    } catch (err) {
      setWarning(err.message);
    }
  };

  return (
    <Grid item>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          color="error"
          onClick={handleDeleteSelected}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Remove" />
        </Button>
      </Toolbar>
    </Grid>
  );
};

export default ListingsListToolbar;
