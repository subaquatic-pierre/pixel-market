import { render, screen } from "@testing-library/react";
import WalletSkeleton from "components/WalletSkeleton";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <WalletSkeleton />
        </BaseComponent>
        );
});
