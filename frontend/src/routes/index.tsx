import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "pages/DashboardPage";
import WalletPage from "pages/WalletPage";
import MarketPlacePage from "pages/MarketplacePage";
import MarketplaceItemPage from "pages/MarketplaceItemPage";
import CreateTokenPage from "pages/CreateTokenPage";
import MyTokenListPage from "pages/MyTokenListPage";
import MyMarketplaceListPage from "pages/MyMarketplaceListPage";
import AuthorRequestsPage from "pages/AuthorRequestListPage";

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/marketplace" element={<MarketPlacePage />} />
      <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
      <Route path="/create" element={<CreateTokenPage />} />
      <Route path="/tokens" element={<MyTokenListPage />} />
      <Route path="/listings" element={<MyMarketplaceListPage />} />
      <Route path="/author-requests" element={<AuthorRequestsPage />} />
    </Routes>
  );
};

export default BaseRouter;
