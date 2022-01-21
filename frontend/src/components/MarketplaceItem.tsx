import React from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useDappContext from "hooks/useDappContext";

export interface IMarketplaceItem {
  id: number;
  imageUrl: string;
  name: string;
  description?: string;
  value: number;
  author: string;
  dateCreated: string;
}

interface IMarketplaceItemProps {
  item: IMarketplaceItem;
}

const MarketplaceItem: React.FC<IMarketplaceItemProps> = ({
  item: { id, imageUrl, name, description, value, dateCreated, author },
}) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const [dappState, _] = useDappContext();

  const checkOwner = () => {
    if (author === dappState.currentAccount) {
      setIsOwner(true);
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      checkOwner();
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
              sx={{ p: 2 }}
              component="img"
              image={imageUrl}
              alt={name}
              height={500}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: 2,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography gutterBottom variant="h4" component="h2">
              {name}
            </Typography>
            <Typography>{description}</Typography>
          </Box>
          <Box sx={{ alignSelf: "end", mt: "auto" }}>
            {!isOwner && (
              <Button variant="contained" component="label" color="secondary">
                Purchase
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketplaceItem;
