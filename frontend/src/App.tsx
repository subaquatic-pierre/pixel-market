import React from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "layout";
import BaseRouter from "routes";

import NotificationContextProvider from "context/NotificationContext";
import DappContextProvider from "context/DappContext";

import themeOptions from "theme";

const theme = createTheme(themeOptions);

const Dapp: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationContextProvider>
          <DappContextProvider>
            <Layout>
              <BaseRouter />
            </Layout>
          </DappContextProvider>
        </NotificationContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default Dapp;
