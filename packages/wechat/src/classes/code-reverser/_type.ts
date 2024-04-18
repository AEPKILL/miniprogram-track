/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 21:52:58
 */

import { FileBundle } from "../file-bundle";

export type ComponentSource = {
  config: Record<string, any>;
  js: string;
  wxml: string;
  wxss: string;
};

export interface ICodeReverser {
  readonly originalBundle: FileBundle;
  readonly restoreBundle: FileBundle;
  readonly appConfig: Record<string, any> | null;
  readonly pages: Record<string, ComponentSource>;

  readonly appServiceParsed: babel.ParseResult | null;
  readonly workersParsed: babel.ParseResult | null;
  readonly appWxssParsed: babel.ParseResult | null;

  readonly gameParsed: babel.ParseResult | null;
  readonly gameConfig: Record<string, any> | null;
}

export type ReversePipeline = (codeReverser: ICodeReverser) => void;
