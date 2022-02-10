import { render, screen } from "@testing-library/react";
import Marketplace from "components/Marketplace";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <Marketplace myListings={[]} />
    </BaseComponent>
  );
});
