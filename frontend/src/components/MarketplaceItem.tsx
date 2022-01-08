import React from "react";

import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export interface IMarketplaceItem {
  id: number;
  url: string;
  name: string;
  description?: string;
  value: number;
  dateCreated: string;
}

interface IMarketplaceItemProps {
  item: IMarketplaceItem;
}

const MarketplaceItem: React.FC<IMarketplaceItemProps> = ({
  item: { id, url, name, description, value, dateCreated },
}) => {
  console.log(url);
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
              image={url}
              alt={name}
              height={500}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {name}
              </Typography>
              <Typography>{description}</Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button color="primary" variant="contained">
                Purchase
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <Box sx={{ p: 2 }}>right side</Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketplaceItem;
