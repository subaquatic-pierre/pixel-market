import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "center",
        mt: 5,
      }}
    >
      <Typography>Footer</Typography>
    </Box>
  );
};

export default Footer;
