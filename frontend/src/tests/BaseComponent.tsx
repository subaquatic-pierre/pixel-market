import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import NotificationContextProvider from "context/NotificationContext";

import themeOptions from "theme";

const theme = createTheme(themeOptions);

const BaseComponent: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <NotificationContextProvider>{children}</NotificationContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default BaseComponent;
