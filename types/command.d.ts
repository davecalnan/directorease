export declare type CommandRun = {
    (args: CommandRunArgs): any | Promise<any>;
};
export declare type CommandRunArgs = {
    args: string[];
    options: {
        [key: string]: string | boolean | Array<string | boolean>;
    };
};
export declare type CommandDescription = string;
export declare type CommandFile = {
    run: CommandRun;
    description?: CommandDescription;
};
export declare const isCommand: (maybeCommand: unknown) => maybeCommand is Command;
export declare class Command {
    name: string;
    description?: string;
    run: CommandRun;
    programPath: string[];
    parentPath: string[];
    filePath: string;
    constructor({ programPath, filePath, description, run, }: {
        programPath: string[];
        filePath: string;
        description?: CommandDescription;
        run: CommandRun;
    });
    static fromFile: ({ filePath, programPath, }: {
        filePath: string;
        programPath: string[];
    }) => Promise<Command>;
    static validateCommandFile: (file: unknown) => file is CommandFile;
}
