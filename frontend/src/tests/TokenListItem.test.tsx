import { render, screen } from "@testing-library/react";
import TokenListItem from "components/TokenListItem";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenListItem token={{} as any} listingInfo={{} as any} />
    </BaseComponent>
  );
});
