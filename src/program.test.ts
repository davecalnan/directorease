import path from "path";
import { generateCLI } from "./program";

it("should generate a hierarchy with descriptions, sorted alphabetically", async () => {
  const cli = await generateCLI(
    path.resolve(__dirname, "../test/fixtures/example-cli")
  );

  expect(cli.toString()).toStrictEqual(
    JSON.stringify({
      drink: {
        coffee: {
          name: "coffee",
          description: "This command gives you energy.",
        },
      },
      eat: {
        an: {
          apple: {
            name: "apple",
            description: "This command keeps the doctor away.",
          },
          orange: {
            name: "orange",
            description: "This command helps prevent scurvy.",
          },
        },
        my: {
          shorts: {
            name: "shorts",
            description: "This command tells someone to eat your shorts.",
          },
        },
        nothing: {
          name: "nothing",
          description: "Go hungry.",
        },
      },
    })
  );
});

it("can generate a directory structure", async () => {
  const cli = await generateCLI(
    path.resolve(__dirname, "../test/fixtures/example-cli")
  );

  // TODO: implement a directory view
});
