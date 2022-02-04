import React from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import formatWalletAddress from "utils/formatWalletAddress";
import useDappContext from "hooks/useDappContext";
import { Link } from "react-router-dom";

interface ITokenInfoProps {
  tokenInfo: ITokenInfo;
  isListing: boolean;
  listingInfo: IListingInfo | undefined;
}

const TokenInfo: React.FC<ITokenInfoProps> = ({
  tokenInfo,
  isListing,
  listingInfo,
}) => {
  const { tokenMeta, author } = tokenInfo;
  const { name, description } = tokenMeta;
  const [dappState, _] = useDappContext();
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [contractAddress, setContractAddress] = React.useState<string>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (dappState.isInitialized) {
      setContractAddress(
        formatWalletAddress(dappState.contracts.pixelMarketplace.address)
      );
    }
  }, [dappState]);

  return (
    <CardContent>
      <Stack spacing={2} sx={{ mb: 2 }}>
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
          {isListing ? (
            <Typography color="text.secondary" variant="h5">
              {listingInfo.value} PIX
            </Typography>
          ) : (
            <>
              <Typography variant="overline" color="text.secondary">
                Unlisted
                <span
                  style={{ marginLeft: 2, fontSize: 8 }}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  &#9432;
                </span>
              </Typography>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Box sx={{ p: 1 }}>
                  <Typography color="text.secondary" fontSize={12}>
                    Token not listed in the marketplace,
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    register as an author and post listing
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    to see the value here
                  </Typography>
                </Box>
              </Popover>
            </>
          )}
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
            <Typography>Attributes:</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {tokenMeta.attributes.map((attr, i) => (
                <Box key={i} display="flex" justifyContent="space-between">
                  <Typography>{attr.trait_type}:</Typography>
                  <Typography color="text.secondary">{attr.value}</Typography>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
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
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </CardContent>
  );
};

export default TokenInfo;
