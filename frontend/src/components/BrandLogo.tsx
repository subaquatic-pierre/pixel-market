import React from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const BrandLogo: React.FC = () => {
  return (
    <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
      <Typography variant="h5">CoolBrand</Typography>
    </Toolbar>
  );
};

export default BrandLogo;
