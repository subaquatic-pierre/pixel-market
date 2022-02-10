import { render, screen } from "@testing-library/react";
import TokenInfo from "components/TokenInfo";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenInfo
        tokenInfo={{} as any}
        isListing={{} as any}
        listingInfo={{} as any}
      />
    </BaseComponent>
  );
});
