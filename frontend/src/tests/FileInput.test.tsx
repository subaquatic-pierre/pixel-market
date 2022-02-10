import { render, screen } from "@testing-library/react";
import FileInput from "components/FileInput";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <FileInput setFile={{} as any} setFileError={{} as any} />
    </BaseComponent>
  );
});
