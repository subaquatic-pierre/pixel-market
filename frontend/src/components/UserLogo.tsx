import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

interface IWalletAddress {
  walletAddress: string;
}

const formatWalletAddress = (walletAddress: string) => {
  const start = walletAddress.slice(0, 5);
  const end = walletAddress.slice(walletAddress.length - 4);
  const text = start + "...." + end;
  return text;
};

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
