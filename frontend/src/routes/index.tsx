import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "pages/DashboardPage";
import WalletPage from "pages/WalletPage";
import MarketPlacePage from "pages/MarketplacePage";
import MarketplaceItemPage from "pages/MarketplaceItemPage";

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/marketplace" element={<MarketPlacePage />} />
      <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
    </Routes>
  );
};

export default BaseRouter;
