import { render, screen } from "@testing-library/react";
import AuthorListToolbar from "components/AuthorListToolbar";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <AuthorListToolbar selected={[]} />
    </BaseComponent>
  );
});
