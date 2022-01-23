import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import formatWalletAddress from "utils/formatWalletAddress";

interface IWalletAddress {
  walletAddress: string;
}

const UserLogo: React.FC<IWalletAddress> = ({ walletAddress }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        px: "20px",
      }}
    >
      <Typography variant="h6">{formatWalletAddress(walletAddress)}</Typography>
      <Box
        sx={{
          maxHeight: "50px",
          maxWidth: "50px",
          display: "flex",
          ml: "20px",
          mr: "-10px",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            padding: "0px",
          }}
          src={`https://robohash.org/${walletAddress}.png?set=set3`}
          alt="user-icon"
        />
      </Box>
    </Card>
  );
};

export default UserLogo;
