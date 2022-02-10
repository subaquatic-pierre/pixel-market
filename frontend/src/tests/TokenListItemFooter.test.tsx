import { render, screen } from "@testing-library/react";
import TokenListItemFooter from "components/TokenListItemFooter";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenListItemFooter tokenId={{} as any} tokenMeta={{} as any} />
    </BaseComponent>
  );
});
