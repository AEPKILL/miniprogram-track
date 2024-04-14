/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 17:59:49
 */

import { IUnPack, UnpackInfo, UnpackOptions } from "@miniprogram-track/shared";
import { injectable } from "husky-di";

@injectable()
export class UnpackWindowsService implements IUnPack {
  unpack(options: UnpackOptions): Promise<UnpackInfo> {
    throw options;
  }
}
