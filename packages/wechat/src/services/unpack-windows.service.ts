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
import { globSync } from "glob";
import { FileBundler } from "@/classes/file-bundler";

@injectable()
export class UnpackWindowsService implements IUnPack {
  async unpack(options: UnpackOptions): Promise<UnpackInfo> {
    const {
      appid,
      pkgPath,
      miniprogramDir,
      targetDir = path.join(process.cwd(), appid)
    } = options;

    const wxapkgPaths: string[] = [];

    if (!miniprogramDir) {
      if (!pkgPath) {
        throw new Error("pkgPath is required");
      }
      if (!fs.existsSync(pkgPath)) {
        throw new Error("pkgPath is not exists");
      }
      wxapkgPaths.push(pkgPath);
    } else {
      for (const it of globSync(["**/*.wxapkg"], {
        cwd: miniprogramDir
      })) {
        wxapkgPaths.push(path.join(miniprogramDir, it));
      }
    }

    const miniprogramOriginalBundler = new FileBundler();
    for (const it of wxapkgPaths) {
      const wxapkg = new WxapkgUnpack({ pkgPath: it, appid });
      const wxapkgBundler = wxapkg.unpack();
      for (const it of wxapkgBundler.filesList) {
        if (miniprogramOriginalBundler.isExist(it.name)) {
          console.warn(`${it.name} is exist, overwrite it`);
        }
        miniprogramOriginalBundler.append(it);
      }
    }

    miniprogramOriginalBundler.saveTo(targetDir);

    return {
      path: targetDir
    };
  }
}
