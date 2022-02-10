import React from "react";
import { useNavigate } from "react-router";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import useDappContext from "hooks/useDappContext";
import transferNFTToken from "utils/transferNFTToken";

import MarketPlaceItemInfo from "components/MarketPlaceItemInfo";
import useNotificationContext from "hooks/useNotificationContext";

interface IMarketplaceItemProps {
  tokenInfo: ITokenInfo;
  listingInfo: IListingInfo;
}

const MarketplaceItem: React.FC<IMarketplaceItemProps> = ({
  tokenInfo,
  listingInfo,
}) => {
  const { author: listingAuthor } = listingInfo;
  const { tokenMeta } = tokenInfo;
  const { image, name } = tokenMeta;
  const [isOwner, setIsOwner] = React.useState(false);
  const [dappState, _] = useDappContext();
  const [_n, { setSuccess, setWarning }] = useNotificationContext();
  const navigate = useNavigate();

  const checkOwner = () => {
    if (
      listingAuthor.walletAddress.toLowerCase() === dappState.currentAccount
    ) {
      setIsOwner(true);
    }
  };

  const handlePurchaseButtonClick = async (event: any) => {
    try {
      const transferRes = await transferNFTToken(dappState, listingInfo);
      console.log(transferRes);
      navigate("/marketplace");
      setSuccess("Token successfully purchased");
    } catch (err) {
      setWarning(`There was an error transferring your token, ${err.message}`);
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
            <CardMedia component="img" image={image} alt={name} height={500} />
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
            <MarketPlaceItemInfo
              tokenInfo={tokenInfo}
              listingInfo={listingInfo}
            />
            <Box sx={{ mt: "auto", alignSelf: "end", p: 1 }}>
              <CardActions>
                {!isOwner && (
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    onClick={handlePurchaseButtonClick}
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
