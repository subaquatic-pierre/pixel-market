import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "pages/DashboardPage";
import WalletPage from "pages/WalletPage";
import MarketPlacePage from "pages/MarketplacePage";
import MarketplaceItemPage from "pages/MarketplaceItemPage";
// import CreateTokenPage from "pages/CreateTokenPage";
import TokenListPage from "pages/TokenListPage";
import AuthorListPage from "pages/AuthorListPage";
import RegisterAuthorPage from "pages/RegisterAuthorPage";
import TokenPage from "pages/TokenPage";

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/marketplace" element={<MarketPlacePage />} />
      <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
      {/* <Route path="/create" element={<CreateTokenPage />} /> */}
      <Route path="/tokens" element={<TokenListPage />} />
      <Route path="/authors" element={<AuthorListPage />} />
      <Route path="/register-author" element={<RegisterAuthorPage />} />
      <Route path="/token/:id" element={<TokenPage />} />
    </Routes>
  );
};

export default BaseRouter;
