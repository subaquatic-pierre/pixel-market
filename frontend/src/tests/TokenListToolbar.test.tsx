import { render, screen } from "@testing-library/react";
import TokenListToolbar from "components/TokenListToolbar";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenListToolbar isAuthor={{} as any} />
    </BaseComponent>
  );
});
