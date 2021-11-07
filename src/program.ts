import * as path from "path";
import * as fs from "fs/promises";
import { Command, isCommand } from "./command";
import { parseArgs } from "./args";

export type CommandGroup = {
  [key: string]: Command | CommandGroup;
};

export type ConciseCommand = {
  name: string;
  description?: string;
};

export type ConciseCommandGroup = {
  [key: string]: ConciseCommand | ConciseCommandGroup;
};

export const generateCLI = async (baseDirectory: string): Promise<Program> => {
  const program = new Program({ baseDirectory });

  await program.registerCommands(baseDirectory);

  return program;
};

const prepareCommandGroupForStringification = (
  group: CommandGroup
): ConciseCommandGroup =>
  Object.fromEntries(
    Object.entries(group)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, commandOrGroup]) => [
        key,
        commandOrGroup instanceof Command
          ? {
              name: commandOrGroup.name,
              description: commandOrGroup.description,
            }
          : prepareCommandGroupForStringification(commandOrGroup),
      ])
  );

const isCommandGroup = (
  maybeCommandGroup: unknown
): maybeCommandGroup is CommandGroup =>
  typeof maybeCommandGroup === "object" &&
  !(maybeCommandGroup instanceof Command);

export class Program {
  public baseDirectory: string;
  public commands: Command[] = [];
  public hierarchy: CommandGroup = {};

  constructor({ baseDirectory }: { baseDirectory: string }) {
    this.baseDirectory = baseDirectory;
  }

  registerCommands = async (
    directory: string,
    currentPath: string[] = []
  ): Promise<void> => {
    const items = await fs.readdir(directory, { withFileTypes: true });

    await Promise.all(
      items.map(async (item) => {
        if (item.isDirectory()) {
          return await this.registerCommands(path.join(directory, item.name), [
            ...currentPath,
            item.name,
          ]);
        }

        /**
         * Don't accept command.ts at the top level.
         */
        if (currentPath.length === 0) return;

        if (item.isFile() && item.name === "command.ts") {
          this.registerCommand(
            await Command.fromFile({
              programPath: currentPath,
              filePath: path.join(directory, item.name),
            })
          );
        }
      })
    );
  };

  registerCommand = async (command: Command): Promise<Command> => {
    this.commands.push(command);

    const parent = command.parentPath.reduce<CommandGroup>(
      (currentGroup, nextGroupName) => {
        if (!isCommandGroup(currentGroup[nextGroupName])) {
          currentGroup[nextGroupName] = {};
        }

        return currentGroup[nextGroupName] as CommandGroup;
      },
      this.hierarchy
    );

    parent[command.name] = command;

    return command;
  };

  toString = ({ spaces }: { spaces?: number } = {}) =>
    JSON.stringify(
      prepareCommandGroupForStringification(this.hierarchy),
      null,
      spaces
    );

  showAvailableCommands = () => {
    console.log("Available commands:");
    console.log(this.toString({ spaces: 2 }));
  };

  call = async (...args: string[]) => {
    if (args.length === 0) {
      this.showAvailableCommands();
      return;
    }

    try {
      const step = (
        hierarchy: CommandGroup,
        args: string[]
      ): [Command | undefined, string[]] => {
        const [nextStep, ...remainingArgs] = args;

        const next = hierarchy[nextStep];
        if (isCommandGroup(next)) {
          return step(next, remainingArgs);
        }

        return [next, remainingArgs];
      };

      const [command, commandArgs] = step(this.hierarchy, args);

      if (isCommand(command)) {
        return await command.run(parseArgs(commandArgs));
      }

      console.error(`Command not found: ${args.join(" ")}`);
      this.showAvailableCommands();
    } catch (error) {
      console.error(error);
    }
  };
}
