import { render, screen } from "@testing-library/react";
import MarketPlaceItemInfo from "components/MarketPlaceItemInfo";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <MarketPlaceItemInfo tokenInfo={{} as any} listingInfo={{} as any} />
    </BaseComponent>
  );
});
