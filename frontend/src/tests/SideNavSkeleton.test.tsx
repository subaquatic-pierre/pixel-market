import { render, screen } from "@testing-library/react";
import SideNavSkeleton from "components/SideNavSkeleton";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <SideNavSkeleton mobileOpen={{} as any} drawerWidth={{} as any} />
    </BaseComponent>
  );
});
