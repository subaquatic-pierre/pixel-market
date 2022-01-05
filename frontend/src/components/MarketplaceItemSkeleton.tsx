import React from "react";

import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const MarketplaceItemSkeleton: React.FC = ({}) => {
  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
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

export default MarketplaceItemSkeleton;
