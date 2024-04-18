/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 11:34:57
 */

import { FileBundle } from "@/classes/file-bundle";
import { BundleFileNameEnum } from "@/enum/bundle-file-name.enum";
import * as babel from "@babel/core";

import { ComponentSource, ICodeReverser } from "./_type";
import { reverseAppJson } from "./pipelines/reverse-app-json";
import { reverseGameJson } from "./pipelines/reverse-game-json";
import { reverseJs } from "./pipelines/reverse-js";
import { reverseOthers } from "./pipelines/reverse-others";
import { reverseWxml } from "./pipelines/reverse-wxml";
import { reverseWxss } from "./pipelines/reverse-wxss";

export class CodeReverser implements ICodeReverser {
  readonly originalBundle: FileBundle;
  readonly restoreBundle: FileBundle;
  readonly appConfig: Record<string, any> | null = null;
  readonly pages: Record<string, ComponentSource>;

  readonly appServiceParsed: babel.ParseResult | null = null;
  readonly workersParsed: babel.ParseResult | null = null;
  readonly appWxssParsed: babel.ParseResult | null = null;

  readonly gameParsed: babel.ParseResult | null = null;
  readonly gameConfig: Record<string, any> | null = null;

  constructor(bundle: FileBundle) {
    this.originalBundle = bundle;
    this.restoreBundle = new FileBundle(`${this.originalBundle}-restore`);

    const appConfigContent = this.originalBundle
      .get(BundleFileNameEnum.appConfig)
      ?.buffer.toString();

    if (appConfigContent) {
      this.appConfig = JSON.parse(appConfigContent);
    }

    const appServiceContent = this.originalBundle
      .get(BundleFileNameEnum.appService)
      ?.buffer.toString();
    if (appServiceContent) {
      this.appServiceParsed = babel.parse(appServiceContent);
    }

    const appWxssContent = this.originalBundle
      .get(BundleFileNameEnum.appWxss)
      ?.buffer.toString();
    if (appWxssContent) {
      this.appWxssParsed = babel.parse(appWxssContent);
    }

    const workersContent = this.originalBundle
      .get(BundleFileNameEnum.workers)
      ?.buffer.toString();
    if (workersContent) {
      this.workersParsed = babel.parse(workersContent);
    }

    const gameConfigContent = this.originalBundle
      .get(BundleFileNameEnum.gameConfig)
      ?.buffer.toString();
    if (gameConfigContent) {
      this.gameConfig = JSON.parse(gameConfigContent);
    }

    const gameContent = this.originalBundle
      .get(BundleFileNameEnum.game)
      ?.buffer.toString();
    if (gameContent) {
      this.gameParsed = babel.parse(gameContent);
    }

    this.pages = {};
  }

  async reverse(): Promise<FileBundle> {
    reverseAppJson(this);
    reverseGameJson(this);

    reverseJs(this);
    reverseWxss(this);
    reverseWxml(this);
    reverseOthers(this);

    return this.restoreBundle;
  }
}
