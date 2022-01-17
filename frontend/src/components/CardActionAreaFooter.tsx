import React from "react";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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

interface ICardActionAreaFooter {
  handleActionAreaButtonClick: (method: string) => void;
  isListing: boolean;
  itemDescription: string;
}

const CardActionAreaFooter: React.FC<ICardActionAreaFooter> = ({
  handleActionAreaButtonClick,
  isListing,
  itemDescription,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <CardActions sx={{ p: 2 }} disableSpacing>
        {isListing ? (
          <Button
            color="warning"
            variant="contained"
            onClick={() => handleActionAreaButtonClick("create")}
          >
            Remove Listing
          </Button>
        ) : (
          <Button
            color="success"
            variant="contained"
            onClick={() => handleActionAreaButtonClick("delete")}
          >
            Post Listing
          </Button>
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

export default CardActionAreaFooter;
