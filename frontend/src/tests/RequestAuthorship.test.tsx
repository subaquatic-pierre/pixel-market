import { render, screen } from "@testing-library/react";
import RequestAuthorship from "components/RequestAuthorship";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <RequestAuthorship />
        </BaseComponent>
        );
});
