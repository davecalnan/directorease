import { CommandRunArgs } from "./command";

const isOption = (arg: string) => arg.startsWith("-");

const parseName = (optionName: string) => {
  return optionName.replace(/^-+/, "");
};

const parseValue = (value: string): string | boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

export const parseArgs = (commandArgs: string[]): CommandRunArgs => {
  const args: CommandRunArgs["args"] = [];
  const options: CommandRunArgs["options"] = {};

  const addOption = (name: string, value: string | string[]) => {
    options[parseName(name)] = Array.isArray(value)
      ? value.map((value) => parseValue(value))
      : parseValue(value);
  };

  for (
    let currentIndex = 0;
    currentIndex < commandArgs.length;
    currentIndex++
  ) {
    const currentArg = commandArgs[currentIndex];
    const remainingArgs: string[] = commandArgs.slice(currentIndex + 1);

    if (isOption(currentArg)) {
      const isOptionAndValue = currentArg.includes("=");
      if (isOptionAndValue) {
        const [name, value] = currentArg.split("=");

        addOption(name, value);
        continue;
      }

      let numberOfValuesToAddToOption = 0;

      for (let arg of remainingArgs) {
        const argIsValue = !!arg && !isOption(arg);

        if (argIsValue) {
          numberOfValuesToAddToOption++;
        } else {
          break;
        }
      }

      if (numberOfValuesToAddToOption > 0) {
        currentIndex += numberOfValuesToAddToOption;

        if (numberOfValuesToAddToOption === 1) {
          addOption(currentArg, remainingArgs[0]);
          continue;
        }

        addOption(
          currentArg,
          remainingArgs.slice(0, numberOfValuesToAddToOption)
        );

        continue;
      }

      addOption(currentArg, "true");
      continue;
    }

    args.push(currentArg);
  }

  return {
    args,
    options,
  };
};
