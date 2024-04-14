/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 19:29:09
 */

import { ExpectedError } from "clime";

export function throwExpectedError(run: (...args: any[]) => any): void {
  try {
    run();
  } catch (error) {
    if (error instanceof Error) {
      throw new ExpectedError(error.message);
    }
    throw new ExpectedError("unknown error.");
  }
}
