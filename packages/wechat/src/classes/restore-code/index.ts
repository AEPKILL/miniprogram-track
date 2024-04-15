/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 11:34:57
 */

import { FileBundler } from "@/classes/file-bundler";

export class RestoreCode {
  #originalBundler: FileBundler;
  #restoreBundler: FileBundler;

  constructor(bundler: FileBundler) {
    this.#originalBundler = bundler;
    this.#restoreBundler = new FileBundler();
  }

  async restore(): Promise<FileBundler> {
    return this.#originalBundler;
  }
}
