import { parseArgs } from "./args";

it("should parse args and options correctly", () => {
  expect(
    parseArgs([
      "arg1",
      "arg2",
      "--implicitBooleanOption",
      "--explicitEqualsTrueOption=true",
      "--explicitTrueOption",
      "true",
      "--explicitEqualsFalseOption=false",
      "--explicitFalseOption",
      "false",
      "--middleCatchAllOption",
      "1",
      "2",
      "3",
      "-a",
      "-b",
      "bee",
      "--valueOption",
      "value",
      "--endCatchAllOption",
      "4",
      "5",
      "6",
    ])
  ).toMatchObject({
    args: ["arg1", "arg2"],
    options: {
      "--implicitBooleanOption": true,
      "--explicitEqualsTrueOption": true,
      "--explicitTrueOption": true,
      "--explicitEqualsFalseOption": false,
      "--explicitFalseOption": false,
      "-a": true,
      "-b": "bee",
      "--valueOption": "value",
      "--middleCatchAllOption": ["1", "2", "3"],
      "--endCatchAllOption": ["4", "5", "6"],
    },
  });
});
