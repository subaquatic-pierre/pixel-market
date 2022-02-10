const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(`${__dirname}/src/components`);

for (const file of files) {
  const filename = path.parse(file).name;
  const content = `import { render, screen } from "@testing-library/react";
import ${filename} from "components/${filename}";
import BaseComponent from "./BaseComponent";


test("renders component", () => {
    render(
        <BaseComponent>
            <${filename} />
        </BaseComponent>
        );
});
`;

  fs.writeFileSync(`${__dirname}/src/tests/${filename}.test.tsx`, content, {
    flag: "w+",
  });
}
