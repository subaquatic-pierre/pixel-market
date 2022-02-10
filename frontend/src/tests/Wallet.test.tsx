import { render, screen } from "@testing-library/react";
import Wallet from "components/Wallet";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <Wallet />
        </BaseComponent>
        );
});
