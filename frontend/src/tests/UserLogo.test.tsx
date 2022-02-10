import { render, screen } from "@testing-library/react";
import UserLogo from "components/UserLogo";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <UserLogo walletAddress={{} as any} />
    </BaseComponent>
  );
});
