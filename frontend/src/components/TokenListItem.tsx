import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import TokenListItemHeading from "components/TokenListItemHeader";

import MarketplaceItemSkeleton from "components/MarketplaceListItemSkeleton";
import TokenListItemFooter from "components/TokenListItemFooter";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface TokenIdToUri {
  tokenId: string;
  tokenUri: string;
}

interface ITokenListItemProps {
  token: TokenIdToUri;
  listingInfo: IListingInfo | null;
}

const TokenListItem: React.FC<ITokenListItemProps> = ({
  token,
  listingInfo,
}) => {
  const [tokenMeta, setTokenMeta] = React.useState<ITokenMeta>(null);
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();

  const loadTokenMeta = () => {
    axios
      .get(token.tokenUri)
      .then((res) => {
        const attrs = res.data.attributes;
        const itemRes: ITokenMeta = {
          tokenId: res.data.tokenId,
          author: res.data.author,
          imageUrl: res.data.imageUrl,
          name: res.data.name,
          description: res.data.description,
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
      loadTokenMeta();
    }
  }, [dappState]);

  return (
    <div>
      {loading && <MarketplaceItemSkeleton />}
      {tokenMeta && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <TokenListItemHeading
            title={tokenMeta.name}
            subtitle={
              listingInfo && listingInfo
                ? `${listingInfo.value.toString()} PIX`
                : "Unlisted"
            }
            listed={listingInfo !== null}
          />
          <Link
            style={{ textDecoration: "none" }}
            to={`/token/${token.tokenId}`}
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
          <TokenListItemFooter tokenId={token.tokenId} tokenMeta={tokenMeta} />
        </Card>
      )}
    </div>
  );
};

export default TokenListItem;
