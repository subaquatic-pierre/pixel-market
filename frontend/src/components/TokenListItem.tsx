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
import { emptyAddress } from "const";

interface TokenIdToUri {
  tokenId: number;
  tokenUri: string;
}

interface ITokenListItemProps {
  token: TokenIdToUri;
  listingInfo: IListingInfo | null;
  isAuthor: boolean;
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
  token,
  listingInfo,
  isAuthor,
}) => {
  const [item, setItem] = React.useState<any>(null);
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();

  const loadItemMeta = () => {
    axios
      .get(token.tokenUri)
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

  const submitCreateListing = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    const resHash = await NFTContract.approve(
      marketplaceContract.address,
      token.tokenId
    );

    const bigNumListingId = await marketplaceContract.createListing(
      token.tokenId,
      item.value
    );

    const listingId = Number(bigNumListingId.toString());
    setSuccess(`Listing created with ID: ${listingId}`);
  };

  const submitRemoveListing = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const NFTContract = dappState.contracts.pixelNFT;

    // Remove any operators
    const resHash = await NFTContract.approve(emptyAddress, token.tokenId);

    // Change to remove listing method
    const bigNumListingId = await marketplaceContract.removeListing(
      listingInfo.listingId
    );
    const listingId = Number(bigNumListingId.toString());
    setSuccess(`Listing removed with ID: ${listingId}`);
  };

  const handleActionAreaButtonClick = (method: string) => {
    if (method === "create") {
      submitCreateListing();
    } else if (method === "delete") {
      submitRemoveListing();
    }
  };

  const getLinkAddress = (): string => {
    if (listingInfo) {
      return `/marketplace/${listingInfo.listingId}`;
    } else {
      return `/token/${token.tokenId}`;
    }
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItemMeta();
    }
  }, [dappState]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {item && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardHeading
            title={item.name}
            subtitle={
              listingInfo && listingInfo
                ? `${listingInfo.value.toString()} PIX`
                : "NOT LISTED"
            }
          />
          <Link style={{ textDecoration: "none" }} to={getLinkAddress()}>
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
            listingInfo={listingInfo}
            itemDescription={item.description}
            isAuthor={isAuthor}
          />
        </Card>
      )}
    </div>
  );
};

export default TokenListItem;
