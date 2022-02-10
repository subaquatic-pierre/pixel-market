import { render, screen } from "@testing-library/react";
import TokenListItemHeader from "components/TokenListItemHeader";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TokenListItemHeader
        title={{} as any}
        subtitle={{} as any}
        listed={{} as any}
      />
    </BaseComponent>
  );
});
