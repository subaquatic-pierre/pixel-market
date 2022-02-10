import { render, screen } from "@testing-library/react";
import Footer from "components/Footer";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <Footer />
        </BaseComponent>
        );
});
