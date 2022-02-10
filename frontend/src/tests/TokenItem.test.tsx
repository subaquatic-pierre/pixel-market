import { render, screen } from "@testing-library/react";
import TokenItem from "components/TokenItem";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenItem
        tokenInfo={{} as any}
        listingInfo={{} as any}
        isListing={{} as any}
        tokenId={{} as any}
      />
    </BaseComponent>
  );
});
