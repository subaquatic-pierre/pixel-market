import { render, screen } from "@testing-library/react";
import MarketplaceListItem from "components/MarketplaceListItem";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <MarketplaceListItem listItem={{} as any} isMyListing={{} as any} />
    </BaseComponent>
  );
});
