import { render, screen } from "@testing-library/react";
import TopNav from "components/TopNav";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <TopNav drawerWidth={{} as any} handleDrawerToggle={{} as any} />
    </BaseComponent>
  );
});
