#!/usr/bin/env ts-node

import path from "path";
import fs from "fs/promises";
import { generateCLI } from "./program";

(async () => {
  let [, , originalBaseDirectory, ...args] = process.argv;

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
})();
