import React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import MailIcon from "@mui/icons-material/Mail";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const WIDTH = 600;

const MainSkeleton = () => {
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
          <Skeleton variant="rectangular" width={WIDTH} height={500} />
        </Stack>
      </Paper>
    </Box>
  );
};

export default MainSkeleton;
