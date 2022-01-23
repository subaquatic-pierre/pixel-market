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

const MarketPlaceItemInfo: React.FC<IMarketplaceItemProps> = ({
  item: { id, imageUrl, name, description, value, dateCreated, author },
}) => {
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <CardContent>
      <Stack spacing={2} sx={{ paddingLeft: 1.7, mb: 2 }}>
        <Box>
          <Typography gutterBottom variant="h4">
            {name}
          </Typography>
          <Typography color="text.secondary">Owned by: {name}</Typography>
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
                <Typography>Creator:</Typography>
                <Typography color="text.secondary">
                  {formatWalletAddress(author)}
                </Typography>
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
