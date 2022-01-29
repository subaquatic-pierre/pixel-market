import React from "react";

import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

interface ICardHeadingProps {
  title: string;
  subtitle: string;
  listed: boolean;
}

const TokenListItemHeading: React.FC<ICardHeadingProps> = ({
  title,
  subtitle,
  listed,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <>
        <Typography variant="overline" color="text.secondary">
          {subtitle}
          <span
            style={{ marginLeft: 2, fontSize: 8 }}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            &#9432;
          </span>
        </Typography>
      </>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
          mt: 0.5,
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
    </Box>
  );
};

export default TokenListItemHeading;
