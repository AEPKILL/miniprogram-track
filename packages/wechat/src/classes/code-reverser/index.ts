/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 11:34:57
 */

import { FileBundle } from "@/classes/file-Bundle";
import { reverseAppJson } from "./_reverse-app-json";

export class CodeReverser {
  #originalBundle: FileBundle;
  #restoreBundle: FileBundle;

  constructor(Bundle: FileBundle) {
    this.#originalBundle = Bundle;
    this.#restoreBundle = new FileBundle();
  }

  async reverse(): Promise<FileBundle> {
    reverseAppJson(this.#originalBundle, this.#restoreBundle);

    return this.#restoreBundle;
  }
}
