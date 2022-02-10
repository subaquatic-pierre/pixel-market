import { render, screen } from "@testing-library/react";
import ListingsListToolbar from "components/ListingsListToolbar";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <ListingsListToolbar selected={[]} />
    </BaseComponent>
  );
});
