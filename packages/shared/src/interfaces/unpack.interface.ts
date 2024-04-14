/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-14 14:47:16
 */

import { createServiceIdentifier } from "husky-di";

export interface UnpackInfo {
  path: string;
}

export interface UnpackOptions {
  appid: string;
  pkgPath?: string;
  miniprogramDir?: string;
  targetDir?: string;

  restoreCode?: boolean;
  formatCode?: boolean;
}

export interface IUnPack {
  unpack(options: UnpackOptions): Promise<UnpackInfo>;
}

export const IUnPack = createServiceIdentifier<IUnPack>("IUnPack");
