import { render, screen } from "@testing-library/react";
import Dashboard from "components/Dashboard";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <Dashboard />
        </BaseComponent>
        );
});
