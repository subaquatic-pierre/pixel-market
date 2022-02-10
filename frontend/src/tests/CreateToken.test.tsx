import { render, screen } from "@testing-library/react";
import CreateToken from "components/CreateToken";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <CreateToken />
        </BaseComponent>
        );
});
