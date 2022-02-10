import { render, screen } from "@testing-library/react";
import BrandLogo from "components/BrandLogo";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <BrandLogo />
        </BaseComponent>
        );
});
