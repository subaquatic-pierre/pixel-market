import { render, screen } from "@testing-library/react";
import ListingsList from "components/ListingsList";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <ListingsList />
        </BaseComponent>
        );
});
