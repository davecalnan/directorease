#!/usr/bin/env ts-node

import { directorease } from "./directorease";

(async () => {
  /**
   * We enforce consumers pass in a string but when using directorease
   * directly as a CLI we read the path as the first argument.
   */
  await directorease(undefined as unknown as string);
})();
