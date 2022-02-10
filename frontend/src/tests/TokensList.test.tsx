import { render, screen } from "@testing-library/react";
import TokensList from "components/TokensList";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <TokensList />
        </BaseComponent>
        );
});
