import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import CardHeader from "@mui/material/CardHeader";

import MarketplaceItemSkeleton from "components/MarketplaceListItemSkeleton";
import TokenListItemFooter from "components/TokenListItemFooter";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface TokenIdToUri {
  tokenId: number;
  tokenUri: string;
}

interface ITokenListItemProps {
  listItem: TokenIdToUri;
  isListing: boolean;
}

interface ICardHeadingProps {
  title: string;
  subtitle: string;
}

const CardHeading: React.FC<ICardHeadingProps> = ({ title, subtitle }) => {
  return (
    <CardHeader
      title={title}
      titleTypographyProps={{ variant: "h6" }}
      subheader={subtitle}
    />
  );
};

const TokenListItem: React.FC<ITokenListItemProps> = ({
  listItem,
  isListing,
}) => {
  const [item, setItem] = React.useState<any>(null);
  const [listingInfo, setListingInfo] = React.useState<any>(null);
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

  const getListingInfo = () => {
    const listItemId = 1;
    // Query pixelMarketPlace contract for listing info

    // Set listing info
  };

  const submitContractCreateRequest = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;
    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      listItem.tokenId
    );
    const bigNumListingId = await marketplaceContract.createListing(
      listItem.tokenId,
      42
    );
    const listingId = Number(bigNumListingId.toString());
    console.log(bigNumListingId);
    console.log(listingId);
  };

  const submitContractDeleteRequest = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    // Change to remove approve
    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      listItem.tokenId
    );

    // Change to remove listing method
    const bigNumListingId = await marketplaceContract.createListing(
      listItem.tokenId,
      42
    );
    const listingId = Number(bigNumListingId.toString());
    console.log(bigNumListingId);
    console.log(listingId);
  };

  const handleActionAreaButtonClick = (method: string) => {
    if (method == "create") {
      submitContractCreateRequest();
    } else if (method === "delete") {
      submitContractDeleteRequest();
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  React.useEffect(() => {
    if (isListing) getListingInfo();
  }, [isListing]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {item && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardHeading
            title={item.name}
            subtitle={isListing ? "100 PIX" : "NOT LISTED"}
          />
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
          <TokenListItemFooter
            handleActionAreaButtonClick={handleActionAreaButtonClick}
            isListing={isListing}
            itemDescription={item.description}
          />
        </Card>
      )}
    </div>
  );
};

export default TokenListItem;
