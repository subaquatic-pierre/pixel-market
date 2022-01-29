import React from "react";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface ICardActionAreaFooterProps {
  handleActionAreaButtonClick: (method: string) => void;
  listingInfo?: any;
  itemDescription: string;
  isAuthor: boolean;
}

const TokenListItemFooter: React.FC<ICardActionAreaFooterProps> = ({
  handleActionAreaButtonClick,
  listingInfo,
  itemDescription,
  isAuthor,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <CardActions sx={{ p: 2 }} disableSpacing>
        {listingInfo && (
          <Button
            color="warning"
            variant="contained"
            onClick={() => handleActionAreaButtonClick("delete")}
          >
            Remove Listing
          </Button>
        )}
        {isAuthor ? (
          <Button
            color="success"
            variant="contained"
            onClick={() => handleActionAreaButtonClick("create")}
          >
            Post Listing
          </Button>
        ) : (
          <>
            <Typography variant="overline" color="text.secondary">
              Not Registered
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
                  You need to register as an author to
                </Typography>
                <Typography color="text.secondary" fontSize={12}>
                  post a token to the marketplace
                </Typography>
              </Box>
            </Popover>
          </>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ mb: 1 }}>Description:</Typography>
          <Typography variant="body2" color="text.secondary">
            {itemDescription}
          </Typography>
        </CardContent>
      </Collapse>
    </div>
  );
};

export default TokenListItemFooter;
