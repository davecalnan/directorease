export type CommandRun = {
  (args: CommandRunArgs): any | Promise<any>;
};

export type CommandRunArgs = {
  args: string[];
  options: {
    [key: string]: string | boolean | Array<string | boolean>;
  };
};

export type CommandDescription = string;

export type CommandFile = {
  run: CommandRun;
  description?: CommandDescription;
};

export const isCommand = (maybeCommand: unknown): maybeCommand is Command =>
  maybeCommand instanceof Command;

export class Command {
  public name: string;
  public description?: string;
  public run: CommandRun;

  public programPath: string[];
  public parentPath: string[];
  public filePath: string;

  constructor({
    programPath,
    filePath,
    description,
    run,
  }: {
    programPath: string[];
    filePath: string;
    description?: CommandDescription;
    run: CommandRun;
  }) {
    const parentPath = [...programPath];
    const name = parentPath.pop() as string;

    this.name = name;
    this.description = description;
    this.run = run;

    this.programPath = programPath;
    this.parentPath = parentPath;
    this.filePath = filePath;
  }

  static fromFile = async ({
    filePath,
    programPath,
  }: {
    filePath: string;
    programPath: string[];
  }): Promise<Command> => {
    const file = await import(filePath);
    if (!this.validateCommandFile(file)) {
      throw new Error(`Invalid command file: ${filePath}`);
    }

    return new Command({
      programPath,
      filePath,
      description: file.description,
      run: file.run,
    });
  };

  static validateCommandFile = (file: unknown): file is CommandFile => {
    if (!(typeof file === "object")) return false;
    if (file === null) return false;
    // @ts-expect-error
    if ("description" in file && typeof file.description !== "string") {
      return false;
    }

    // @ts-expect-error
    return "run" in file && typeof file.run === "function";
  };
}
