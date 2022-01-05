import React from "react";

import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { IMarketplaceItem } from "components/MarketplaceItem";

interface IMarketplaceListItemProps {
  listItem: IMarketplaceItem;
}

const MarketplaceListItem: React.FC<IMarketplaceListItemProps> = ({
  listItem: { id, url, name, description, value, dateCreated },
}) => {
  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        image="https://source.unsplash.com/random"
        alt="random"
        height={300}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <CardActions>
        <Link style={{ textDecoration: "none" }} to={`/marketplace/${id}`}>
          <Button size="small">View</Button>
        </Link>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  );
};

export default MarketplaceListItem;
