import { render, screen } from "@testing-library/react";
import TopNavSkeleton from "components/TopNavSkeleton";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TopNavSkeleton drawerWidth={{} as any} />
    </BaseComponent>
  );
});
