import { Command } from "./command";
export declare type CommandGroup = {
    [key: string]: Command | CommandGroup;
};
export declare type ConciseCommand = {
    name: string;
    description?: string;
};
export declare type ConciseCommandGroup = {
    [key: string]: ConciseCommand | ConciseCommandGroup;
};
export declare const generateCLI: (baseDirectory: string) => Promise<Program>;
export declare class Program {
    baseDirectory: string;
    commands: Command[];
    hierarchy: CommandGroup;
    constructor({ baseDirectory }: {
        baseDirectory: string;
    });
    registerCommands: (directory: string, currentPath?: string[]) => Promise<void>;
    registerCommand: (command: Command) => Promise<Command>;
    toString: ({ spaces }?: {
        spaces?: number;
    }) => string;
    showAvailableCommands: () => void;
    call: (...args: string[]) => Promise<any>;
}
