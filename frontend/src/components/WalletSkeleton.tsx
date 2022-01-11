import React from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const WIDTH = 600;

const WalletSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={70} height={70} />
          <Skeleton variant="text" width={WIDTH} height={50} />
          <Skeleton variant="text" width={WIDTH} height={50} />
          <Skeleton variant="text" width={WIDTH} height={50} />
          <Skeleton variant="rectangular" width={WIDTH} height={300} />
        </Stack>
      </Paper>
    </Box>
  );
};

export default WalletSkeleton;
