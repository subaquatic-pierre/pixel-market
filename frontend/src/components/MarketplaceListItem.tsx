import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

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

import transferNFTToken from "utils/transferNFTToken";

interface IMarketplaceListItemProps {
  listItem: IMarketplaceItem;
  isMyListing: boolean;
}

type TokenMeta = ITokenInfo | null;

const MarketplaceListItem: React.FC<IMarketplaceListItemProps> = ({
  listItem,
  isMyListing,
}) => {
  const { tokenUri, tokenId } = listItem;
  const [tokenInfo, setTokenInfo] = React.useState<TokenMeta>(null);
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();
  const navigate = useNavigate();

  const getTokenAuthor = async (tokenId: string): Promise<string> => {
    const NFTContract = dappState.contracts.pixelNFT;
    const author = await NFTContract.ownerOf(tokenId);
    return author;
  };

  const getTokenMeta = async (tokenUri: string): Promise<ITokenMeta> => {
    try {
      const res = await axios.get(listItem.tokenUri);
      const tokenMeta: ITokenMeta = {
        imageUri: res.data.imageUri,
        name: res.data.name,
        description: res.data.description,
        attributes: [],
      };
      return tokenMeta;
    } catch (err) {
      setWarning(err.message);
    }
  };

  const loadItem = async () => {
    try {
      const tokenMeta = await getTokenMeta(tokenUri);
      const author = await getTokenAuthor(tokenId);
      const tokenInfo: ITokenInfo = {
        tokenId,
        author,
        tokenMeta,
      };
      setTokenInfo(tokenInfo);
      setLoading(false);
    } catch (err) {
      setWarning(err.message);
      return;
    }
  };

  const handlePurchaseButtonClick = async (event: any) => {
    try {
      const transferRes = await transferNFTToken(
        dappState,
        listItem.listingInfo
      );
      console.log(transferRes);
      navigate("/marketplace");
      setSuccess("Token successfully purchased");
    } catch (err) {
      setWarning(`There was an error transferring your token, ${err.message}`);
      console.log(err.message);
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {tokenInfo && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Link
            style={{ textDecoration: "none" }}
            to={`/marketplace/${listItem.listingInfo.listingId}`}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={tokenInfo.tokenMeta.imageUri}
                alt={tokenInfo.tokenMeta.name}
                height={300}
              />
            </CardActionArea>
          </Link>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {tokenInfo.tokenMeta.name}
            </Typography>
            <Typography>{tokenInfo.tokenMeta.description}</Typography>
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
              <Button
                sx={{ mr: 1 }}
                color="secondary"
                variant="contained"
                onClick={handlePurchaseButtonClick}
              >
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
