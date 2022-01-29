import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import useDappContext from "hooks/useDappContext";

import TokenInfo from "components/TokenInfo";

interface IMarketplaceItemProps {
  tokenMeta: ITokenMeta;
}

const TokenItem: React.FC<IMarketplaceItemProps> = ({ tokenMeta }) => {
  const { imageUrl, name, author } = tokenMeta;
  const [dappState, _] = useDappContext();
  const [authorState, setAuthorState] = React.useState<any>({
    loading: true,
    isAuthor: true,
  });

  const checkAuthorshipStatus = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const isAuthor = await marketplaceContract.isAuthor(
      dappState.currentAccount
    );

    if (isAuthor) {
      setAuthorState({
        isAuthor: true,
        loading: false,
      });
    } else {
      setAuthorState({
        isAuthor: false,
        loading: false,
      });
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      checkAuthorshipStatus();
    }
  }, [dappState]);

  return (
    <Paper>
      <Grid container spacing={0}>
        <Grid item sm={12} md={6}>
          <Card
            sx={{ display: "flex", flexDirection: "column" }}
            raised={false}
            square
            elevation={0}
          >
            <CardMedia
              component="img"
              image={imageUrl}
              alt={name}
              height={500}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              border: "none",
            }}
            elevation={0}
          >
            <TokenInfo tokenMeta={tokenMeta} />
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenItem;
