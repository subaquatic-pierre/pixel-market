import React from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

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

  const transferNFTToken = async () => {
    // Get contracts
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const tokenContract = dappState.contracts.pixelToken;
    const NFTContract = dappState.contracts.pixelNFT;

    // Get item details
    const tokenId = item.id;
    const itemValue = item.value;

    // Get owner of token address, and receiver of NFT
    const ownerAddress = await NFTContract.ownerOf(item.id);
    const receiverAddress = dappState.currentAccount;

    // Set allowance for marketplace contract to spend tokens
    const approveTokenSpendRes = tokenContract.approve(
      marketplaceContract.address,
      itemValue
    );

    // const resHash = await marketplaceContract.transferToken(ownerAddress, receiverAddress,tokenId);/

    console.log(dappState);
  };

  const handlePurchaseButtonClick = (event: any) => {
    transferNFTToken();
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      checkOwner();
      // console.log(dappState);
    }
  }, _[dappState]);

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
