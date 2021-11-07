import * as path from "path";
import * as fs from "fs/promises";
import { generateCLI } from "./program";

export const directorease = async (directory: string) => {
  const { originalBaseDirectory, args } = (() => {
    if (typeof directory === "string") {
      return {
        originalBaseDirectory: directory,
        args: process.argv.slice(2),
      };
    }

    return {
      originalBaseDirectory: process.argv[2],
      args: process.argv.slice(3),
    };
  })();

  const baseDirectory = path.isAbsolute(originalBaseDirectory)
    ? originalBaseDirectory
    : path.resolve(process.cwd(), originalBaseDirectory);

  try {
    if (!(await fs.stat(baseDirectory)).isDirectory()) {
      throw new Error();
    }
  } catch {
    console.error(
      `The first argument to \`directorease\` must be the root directory for your CLI. Given: ${originalBaseDirectory}`
    );
    process.exit(1);
  }

  const cli = await generateCLI(baseDirectory);
  await cli.call(...args);
};
