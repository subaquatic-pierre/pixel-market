import { render, screen } from "@testing-library/react";
import AdminList from "components/AdminList";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <AdminList />
        </BaseComponent>
        );
});
