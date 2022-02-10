import { render, screen } from "@testing-library/react";
import AuthorList from "components/AuthorList";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <AuthorList />
        </BaseComponent>
        );
});
