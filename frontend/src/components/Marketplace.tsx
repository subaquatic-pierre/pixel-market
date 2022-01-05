import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import listings from "fixtures/listings";

import MarketplaceItem from "components/MarketplaceItem";

const Marketplace = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        {listings.map((card, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <MarketplaceItem />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
