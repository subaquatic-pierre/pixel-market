import { render, screen } from "@testing-library/react";
import MarketplaceItem from "components/MarketplaceItem";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <MarketplaceItem tokenInfo={{} as any} listingInfo={{} as any} />
    </BaseComponent>
  );
});
