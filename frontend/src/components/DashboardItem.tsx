import React from "react";

import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const DashboardItem: React.FC = () => {
  return (
    <Card
      sx={{ display: "flex", flexDirection: "column" }}
      square
      elevation={0}
    >
      <Stack spacing={1}>
        <Skeleton variant="rectangular" height={300} />
        <Box sx={{ px: 2, pb: 2 }}>
          <Skeleton variant="text" height={50} />
          <Skeleton variant="text" height={50} />
        </Box>
      </Stack>
    </Card>
  );
};

export default DashboardItem;
