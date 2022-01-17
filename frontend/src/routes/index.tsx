import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "pages/DashboardPage";
import WalletPage from "pages/WalletPage";
import MarketPlacePage from "pages/MarketplacePage";
import MarketplaceItemPage from "pages/MarketplaceItemPage";
import CreateTokenPage from "pages/CreateTokenPage";
import TokenListPage from "pages/TokenListPage";
import MyMarketplaceListPage from "pages/MyMarketplaceListPage";
import AuthorListPage from "pages/AuthorListPage";
import RegisterAuthorPage from "pages/RegisterAuthorPage";

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/marketplace" element={<MarketPlacePage />} />
      <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
      <Route path="/create" element={<CreateTokenPage />} />
      <Route path="/tokens" element={<TokenListPage />} />
      <Route path="/listings" element={<MyMarketplaceListPage />} />
      <Route path="/authors" element={<AuthorListPage />} />
      <Route path="/register-author" element={<RegisterAuthorPage />} />
    </Routes>
  );
};

export default BaseRouter;
