import { render, screen } from "@testing-library/react";
import SideNav from "components/SideNav";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <SideNav
        mobileOpen={{} as any}
        drawerWidth={{} as any}
        handleDrawerToggle={{} as any}
      />
    </BaseComponent>
  );
});
