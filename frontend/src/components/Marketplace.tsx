import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import listings from "fixtures/listings";

import MarketplaceListItem from "components/MarketplaceListItem";
import MarketplaceItemSkeleton from "components/MarketplaceListItemSkeleton";

const Marketplace: React.FC = () => {
  const [state, setState] = React.useState({ loading: true });

  const getListItems = () => {
    setTimeout(() => {
      setState({ loading: false });
    }, 500);
  };

  React.useEffect(() => {
    getListItems();
  }, []);
  return (
    <Box>
      <Grid container spacing={4}>
        {listings.map((listItem, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            {state.loading ? (
              <MarketplaceItemSkeleton />
            ) : (
              <MarketplaceListItem listItem={listItem} />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
