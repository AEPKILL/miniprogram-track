/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 11:34:57
 */

import { FileBundle } from "@/classes/file-bundle";
import { ComponentSource, ICodeReverser } from "./_type";
import { reverseAppJson } from "./pipelines/reverse-app-json";
import { reverseJs } from "./pipelines/reverse-js";
import { reverseWxss } from "./pipelines/reverse-wxss";
import { reverseWxml } from "./pipelines/reverse-wxml";

export class CodeReverser implements ICodeReverser {
  originalBundle: FileBundle;
  restoreBundle: FileBundle;
  appConfig: Record<string, any>;
  pages: Record<string, ComponentSource>;

  constructor(bundle: FileBundle) {
    this.originalBundle = bundle;
    this.restoreBundle = new FileBundle();

    const appConfigContent = this.originalBundle
      .get("/app-config.json")
      ?.buffer.toString();

    if (appConfigContent) {
      this.appConfig = JSON.parse(appConfigContent);
    } else {
      this.appConfig = {};
    }

    this.pages = {};
  }

  async reverse(): Promise<FileBundle> {
    if (this.appConfig.pages) {
      reverseAppJson(this);
    }

    reverseJs(this);
    reverseWxss(this);
    reverseWxml(this);

    return this.restoreBundle;
  }
}
