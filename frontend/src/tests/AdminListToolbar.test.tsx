import { render, screen } from "@testing-library/react";
import AdminListToolbar from "components/AdminListToolbar";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <AdminListToolbar />
        </BaseComponent>
        );
});
