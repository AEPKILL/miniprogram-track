/*
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 12:27:07
 */
import { createServiceIdentifier } from "husky-di";

export interface UnpackInfo {
  path: string;
}

export interface UnpackOptions {
  pkgPath: string;
}

export interface IUnPack {
  unpack(options: UnpackOptions): Promise<UnpackInfo>;
}

export const IUnPack = createServiceIdentifier<IUnPack>("IUnPack");
