import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import useNotificationContext from "hooks/useNotificationContext";
import useDappContext from "hooks/useDappContext";
import { emptyAddress } from "const";

import TokenInfo from "components/TokenInfo";

interface IMarketplaceItemProps {
  tokenMeta: ITokenMeta;
}

const TokenItem: React.FC<IMarketplaceItemProps> = ({ tokenMeta }) => {
  const { imageUrl, name, author } = tokenMeta;
  const [dappState, _] = useDappContext();
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [authorState, setAuthorState] = React.useState<any>({
    loading: true,
    isAuthor: true,
  });

  const submitCreateListing = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      tokenMeta.tokenId
    );

    const bigNumListingId = await marketplaceContract.createListing(
      tokenMeta.tokenId,
      tokenMeta.value
    );

    const listingId = Number(bigNumListingId.toString());
    setSuccess(`Listing created with ID: ${listingId}`);
  };

  // const submitRemoveListing = async () => {
  //   const marketplaceContract = dappState.contracts.pixelMarketplace;
  //   const NFTContract = dappState.contracts.pixelNFT;

  //   // Remove any operators
  //   await NFTContract.approve(emptyAddress, token.tokenId);

  //   // Change to remove listing method
  //   const bigNumListingId = await marketplaceContract.removeListing(
  //     listingInfo.listingId
  //   );
  //   const listingId = Number(bigNumListingId.toString());
  //   setSuccess(`Listing removed with ID: ${listingId}`);
  // };

  const handleActionAreaButtonClick = (method: string) => {
    if (method === "create") {
      submitCreateListing();
    } else if (method === "delete") {
      // submitRemoveListing();
    }
  };

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
            <CardActions sx={{ mt: "auto", px: 2, pb: 2, alignSelf: "end" }}>
              <Button
                color="warning"
                variant="contained"
                // onClick={() => handleActionAreaButtonClick("delete")}
              >
                Remove Listing
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenItem;
