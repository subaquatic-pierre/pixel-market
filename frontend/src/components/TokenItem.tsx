import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import useNotificationContext from "hooks/useNotificationContext";
import useDappContext from "hooks/useDappContext";
import { emptyAddress } from "const";

import TokenInfo from "components/TokenInfo";

interface ITokenItemProps {
  tokenInfo: ITokenInfo;
  listingInfo: IListingInfo | undefined;
  isListing: boolean;
  tokenId: string;
}

interface ITokenItemState {
  isAuthor: boolean;
}

const initialTokenItemState: ITokenItemState = {
  isAuthor: true,
};

const TokenItem: React.FC<ITokenItemProps> = ({
  tokenInfo,
  listingInfo,
  tokenId,
  isListing,
}) => {
  const { tokenMeta, author } = tokenInfo;
  const { imageUrl, name } = tokenMeta;
  const [dappState, _] = useDappContext();
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [state, setState] = React.useState<ITokenItemState>(
    initialTokenItemState
  );
  const [listingValue, setListingValue] = React.useState("");

  const checkIfListing = () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
  };

  const submitCreateListing = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      tokenId
    );

    const bigNumListingId = await marketplaceContract.createListing(
      tokenId,
      listingValue
    );

    const listingId = Number(bigNumListingId.toString());
    setSuccess(`Listing created with ID: ${listingId}`);
  };

  const submitRemoveListing = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    // Remove any operators
    await NFTContract.approve(emptyAddress, tokenId);

    // Change to remove listing method
    const bigNumListingId = await marketplaceContract.removeListing(
      listingInfo.listingId
    );
    const listingId = Number(bigNumListingId.toString());
    setSuccess(`Listing removed with ID: ${listingId}`);
  };

  const handleActionAreaButtonClick = (method: string) => {
    if (method === "create") {
      if (listingValue === "") {
        setWarning("Please enter listing Amount");
      } else {
        submitCreateListing();
      }
    } else if (method === "delete") {
      submitRemoveListing();
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      setState((oldState) => ({ ...oldState, isAuthor: dappState.isAuthor }));
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
            <TokenInfo
              tokenInfo={tokenInfo}
              isListing={isListing}
              listingInfo={listingInfo}
            />
            {state.isAuthor && (
              <CardActions
                sx={{
                  mt: "auto",
                  px: 2,
                  pb: 2,
                  justifyContent: "space-between",
                }}
              >
                {!isListing ? (
                  <>
                    <Box>
                      <TextField
                        id="outlined-name"
                        label="Value"
                        name="listing-value"
                        value={listingValue}
                        onChange={(event) =>
                          setListingValue(event.target.value)
                        }
                        fullWidth
                      />
                    </Box>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() => handleActionAreaButtonClick("create")}
                    >
                      Create Listing
                    </Button>
                  </>
                ) : (
                  <>
                    <Box></Box>
                    <Button
                      color="warning"
                      variant="contained"
                      onClick={() => handleActionAreaButtonClick("delete")}
                    >
                      Remove Listing
                    </Button>
                  </>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenItem;
