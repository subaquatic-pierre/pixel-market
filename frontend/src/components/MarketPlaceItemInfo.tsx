import React from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import formatWalletAddress from "utils/formatWalletAddress";
import useDappContext from "hooks/useDappContext";
import { Link } from "react-router-dom";

interface IMarketplaceItemProps {
  tokenInfo: ITokenInfo;
  listingInfo: IListingInfo;
}

const MarketPlaceItemInfo: React.FC<IMarketplaceItemProps> = ({
  tokenInfo,
  listingInfo,
}) => {
  const { tokenMeta, author } = tokenInfo;
  const { name, description, dateCreated } = tokenMeta;
  const { value } = listingInfo;
  const [dappState, _] = useDappContext();
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [contractAddress, setContractAddress] = React.useState<string>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      setContractAddress(
        formatWalletAddress(dappState.contracts.pixelMarketplace.address)
      );
    }
  }, [dappState]);
  return (
    <CardContent>
      <Stack spacing={2} sx={{ paddingLeft: 1.7, pt: 1.7, mb: 2 }}>
        <Box>
          <Typography gutterBottom variant="h4">
            {name}
          </Typography>
          <Typography color="text.secondary">
            Owned by:{" "}
            <span>
              <Link style={{ color: "inherit", textDecoration: "none" }} to="">
                {formatWalletAddress(author)}
              </Link>
            </span>
          </Typography>
        </Box>
        <Box>
          <Typography gutterBottom variant="subtitle2">
            Value:
          </Typography>
          <Typography color="text.secondary" variant="h5">
            {value} PIX
          </Typography>
        </Box>
      </Stack>
      <Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>Description:</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{description}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography>Details:</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Contract Address:</Typography>
                <Link to="" style={{ textDecoration: "none" }}>
                  <Typography color="text.link">{contractAddress}</Typography>
                </Link>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Creator:</Typography>
                <Link to="" style={{ textDecoration: "none" }}>
                  <Typography color="text.link">
                    {formatWalletAddress(author)}
                  </Typography>
                </Link>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Date Created:</Typography>
                <Typography color="text.secondary">{dateCreated}</Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </CardContent>
  );
};

export default MarketPlaceItemInfo;
