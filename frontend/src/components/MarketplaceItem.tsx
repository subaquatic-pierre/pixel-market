import React from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TextField from "@mui/material/TextField";
import useDappContext from "hooks/useDappContext";

import MarketPlaceItemInfo from "./MarketPlaceItemInfo";

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

const MarketplaceItem: React.FC<IMarketplaceItemProps> = ({ item }) => {
  const { id, imageUrl, name, author } = item;
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
            <MarketPlaceItemInfo item={item} />
            <Box sx={{ mt: "auto", alignSelf: "end", p: 1 }}>
              <CardActions>
                <Button size="medium" variant="contained">
                  Share
                </Button>
                <Button size="medium" variant="contained">
                  Learn More
                </Button>
                <Button size="medium" variant="contained">
                  Learn More
                </Button>
                {!isOwner && (
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                  >
                    Purchase
                  </Button>
                )}
              </CardActions>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketplaceItem;
