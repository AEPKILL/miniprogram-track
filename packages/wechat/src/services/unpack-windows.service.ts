/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 17:59:49
 */

import fs from "fs";
import { globSync } from "glob";
import { injectable } from "husky-di";
import path from "path";

import { CodeReverser } from "@/classes/code-reverser";
import { WxapkgUnpack } from "@/classes/wxapkg-unpack";
import { IUnPack, UnpackInfo, UnpackOptions } from "@miniprogram-track/shared";

@injectable()
export class UnpackWindowsService implements IUnPack {
  async unpack(options: UnpackOptions): Promise<UnpackInfo> {
    const {
      appid,
      pkgPath,
      miniprogramDir,
      restoreCode,
      targetDir = path.join(process.cwd(), appid)
    } = options;

    const wxapkgPaths: string[] = [];

    if (!miniprogramDir) {
      if (!pkgPath) {
        throw new Error("pkgPath is required");
      }
      if (!fs.existsSync(pkgPath)) {
        throw new Error(`pkgPath ${pkgPath} 不存在`);
      }
      wxapkgPaths.push(pkgPath);
    } else {
      if (!fs.existsSync(miniprogramDir)) {
        throw new Error(`miniprogramDir "${miniprogramDir}" 不存在`);
      }

      for (const it of globSync(["**/*.wxapkg"], {
        cwd: miniprogramDir
      })) {
        wxapkgPaths.push(path.join(miniprogramDir, it));
      }
    }
    for (const it of wxapkgPaths) {
      const wxapkg = new WxapkgUnpack({ pkgPath: it, appid });
      const wxapkgBundle = wxapkg.unpack();
      const finallyBundle = restoreCode
        ? await new CodeReverser(wxapkgBundle).reverse()
        : wxapkgBundle;

      if (restoreCode) {
        await finallyBundle.saveTo(path.join(targetDir));
      } else {
        await finallyBundle.saveTo(path.join(targetDir, path.parse(it).name));
      }
    }

    return {
      path: targetDir
    };
  }
}
