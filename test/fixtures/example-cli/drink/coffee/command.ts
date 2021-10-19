import { CommandDescription, CommandRun } from "../../../../../src/command";

export const description: CommandDescription = "This command gives you energy.";

export const run: CommandRun = async ({ args, options }) => {
  console.log("drink coffee");
};
