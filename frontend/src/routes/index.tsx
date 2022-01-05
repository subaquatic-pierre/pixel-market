import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "pages/DashboardPage";
import WalletPage from "pages/WalletPage";
import MarketPlacePage from "pages/MarketplacePage";

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/marketplace" element={<MarketPlacePage />} />
    </Routes>
  );
};

export default BaseRouter;
