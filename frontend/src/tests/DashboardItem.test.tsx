import { render, screen } from "@testing-library/react";
import DashboardItem from "components/DashboardItem";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <DashboardItem />
        </BaseComponent>
        );
});
