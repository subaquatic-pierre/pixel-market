import { render, screen } from "@testing-library/react";
import CreateTokenForm from "components/CreateTokenForm";
import BaseComponent from "./BaseComponent";

test("renders component", () => {
  render(
    <BaseComponent>
      <CreateTokenForm
        formState={{} as any}
        setFileError={{} as any}
        handleInputChange={{} as any}
        setFile={{} as any}
        handleCreateToken={{} as any}
        fileError={true}
      />
    </BaseComponent>
  );
});
