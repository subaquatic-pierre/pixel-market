import { render, screen } from "@testing-library/react";
import MarketplaceItemSkeleton from "components/MarketplaceItemSkeleton";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <MarketplaceItemSkeleton />
        </BaseComponent>
        );
});
