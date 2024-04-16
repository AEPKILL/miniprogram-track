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
  readonly appConfig: Record<string, any>;
}

export type ReversePipeline = (codeReverser: ICodeReverser) => void;
