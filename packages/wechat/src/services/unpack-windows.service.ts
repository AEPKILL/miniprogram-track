/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 17:59:49
 */

import { IUnPack, UnpackInfo, UnpackOptions } from "@miniprogram-track/shared";
import { injectable } from "husky-di";
import fs from "fs";
import { WxapkgUnpack } from "@/classes/wxapkg-unpack";
import path from "path";

@injectable()
export class UnpackWindowsService implements IUnPack {
  async unpack(options: UnpackOptions): Promise<UnpackInfo> {
    const {
      appid,
      pkgPath,
      targetDir = path.join(process.cwd(), appid)
    } = options;

    if (!pkgPath) {
      throw new Error("pkgPath is required");
    }

    if (!fs.existsSync(pkgPath)) {
      throw new Error("pkgPath is not exists");
    }

    const wxapkg = new WxapkgUnpack({ pkgPath, appid });

    wxapkg.unpack({
      targetDir
    });

    return {
      path: targetDir
    };
  }
}
