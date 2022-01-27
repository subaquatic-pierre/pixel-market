import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import MarketplaceItemSkeleton from "components/MarketplaceListItemSkeleton";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface IMarketplaceListItemProps {
  listItem: IMarketplaceItem;
  isMyListing: boolean;
}

type TokenMeta = ITokenMeta | null;

const MarketplaceListItem: React.FC<IMarketplaceListItemProps> = ({
  listItem,
  isMyListing,
}) => {
  const [tokenMeta, setTokenMeta] = React.useState<TokenMeta>(null);
  const [_n, { setWarning }] = useNotificationContext();
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();

  const loadItem = () => {
    axios
      .get(listItem.tokenUri)
      .then((res) => {
        const attrs = res.data.attributes;
        const itemRes: ITokenMeta = {
          tokenId: res.data.tokenId,
          imageUrl: res.data.imageUrl,
          author: res.data.author,
          name: res.data.name,
          description: res.data.description,
          value: attrs[0].value,
          dateCreated: "some date",
        };
        setTokenMeta(itemRes);
        setLoading(false);
      })
      .catch((err) => {
        setWarning(err.message);
        return;
      });
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {tokenMeta && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Link
            style={{ textDecoration: "none" }}
            to={`/marketplace/${listItem.listingInfo.listingId}`}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={tokenMeta.imageUrl}
                alt={tokenMeta.name}
                height={300}
              />
            </CardActionArea>
          </Link>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {tokenMeta.name}
            </Typography>
            <Typography>{tokenMeta.description}</Typography>
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/marketplace/${listItem.listingInfo.listingId}`}
            >
              <Button sx={{ mr: 1 }} color="primary" variant="contained">
                View
              </Button>
            </Link>
            {!isMyListing && (
              <Button sx={{ mr: 1 }} color="secondary" variant="contained">
                Purchase
              </Button>
            )}
          </CardActions>
        </Card>
      )}
    </div>
  );
};

export default MarketplaceListItem;
