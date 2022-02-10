import { render, screen } from "@testing-library/react";
import MarketplaceListItemSkeleton from "components/MarketplaceListItemSkeleton";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <MarketplaceListItemSkeleton />
        </BaseComponent>
        );
});
