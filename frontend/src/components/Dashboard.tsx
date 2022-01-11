import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import DashboardItem from "components/DashboardItem";

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        {Array(4)
          .fill(1)
          .map((listItem, index) => (
            <Grid item key={index} xs={12} sm={6}>
              <DashboardItem />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
