import { CommandRunArgs } from "./command";

const isOption = (arg: string) => arg.startsWith("-");

const parseValue = (value: string): string | boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

export const parseArgs = (commandArgs: string[]): CommandRunArgs => {
  const args: CommandRunArgs["args"] = [];
  const options: CommandRunArgs["options"] = {};

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
        const [option, value] = currentArg.split("=");

        options[option] = parseValue(value);
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
          options[currentArg] = parseValue(remainingArgs[0]);
          continue;
        }

        options[currentArg] = remainingArgs
          .slice(0, numberOfValuesToAddToOption)
          .map((value) => parseValue(value));
        continue;
      }

      options[currentArg] = true;
      continue;
    }

    args.push(currentArg);
  }

  return {
    args,
    options,
  };
};
