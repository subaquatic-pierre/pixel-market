import { render, screen } from "@testing-library/react";
import AlertMessage from "components/AlertMessage";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <AlertMessage />
        </BaseComponent>
        );
});
