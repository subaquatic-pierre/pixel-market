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

interface TokenIdToUri {
  tokenId: number;
  tokenUri: string;
}

interface IMyListingsListItemProps {
  listItem: TokenIdToUri;
}

const MyListingsListItem: React.FC<IMyListingsListItemProps> = ({
  listItem,
}) => {
  const [item, setItem] = React.useState<any>(null);
  const [_n, { setWarning }] = useNotificationContext();
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();

  const loadItem = () => {
    axios
      .get(listItem.tokenUri)
      .then((res) => {
        const attrs = res.data.attributes;
        const itemRes = {
          id: res.data.tokenId,
          imageUrl: res.data.imageUrl,
          name: res.data.name,
          description: res.data.description,
          value: attrs[0].value,
          dateCreated: "some date",
        };
        setItem(itemRes);
        setLoading(false);
      })
      .catch((err) => {
        setWarning(err.message);
        return;
      });
  };

  const submitContractRequest = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;
    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      listItem.tokenId
    );
    // console.log(resHash);
    const bigNumListingId = await marketplaceContract.deleteListing(
      listItem.tokenId
    );
    const listingId = Number(bigNumListingId.toString());
  };

  const handleRemoveItemClick = () => {
    submitContractRequest();
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {item && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Link
            style={{ textDecoration: "none" }}
            to={`/marketplace/${listItem.tokenId}`}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.name}
                height={300}
              />
            </CardActionArea>
          </Link>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {item.name}
            </Typography>
            <Typography>{item.description}</Typography>
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Button sx={{ mr: 1 }} color="warning" variant="contained">
              Remove Listing
            </Button>
          </CardActions>
        </Card>
      )}
    </div>
  );
};

export default MyListingsListItem;
