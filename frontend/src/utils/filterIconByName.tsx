import React from "react";

import AddReactionIcon from "@mui/icons-material/AddReaction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MailIcon from "@mui/icons-material/Mail";
import CreateIcon from "@mui/icons-material/Create";
import TokenIcon from "@mui/icons-material/Token";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ListIcon from "@mui/icons-material/List";

const filterIconByName = (iconName: string) => {
  switch (iconName) {
    case "dashboard":
      return <DashboardIcon />;
    case "wallet":
      return <MailIcon />;
    case "market":
      return <StorefrontIcon />;
    case "create":
      return <CreateIcon />;
    case "token":
      return <TokenIcon />;
    case "listings":
      return <ListIcon />;
    case "author":
      return <AddReactionIcon />;
    case "admins":
      return <AdminPanelSettingsIcon />;

    default:
      return <AddReactionIcon />;
  }
};

export default filterIconByName;
