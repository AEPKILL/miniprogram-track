/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 14:35:23
 */

import { injectable } from "husky-di";
import os from "os";
import path from "path";
import { promisified } from "regedit";
import { globSync } from "glob";

import { IScan, MiniprogramInfo } from "@miniprogram-track/shared";
import { getPartialMiniprogramInfoByAppid } from "@/utils/weapp-info.utils";

@injectable()
export class ScanWindowsService implements IScan {
  async scan(): Promise<MiniprogramInfo[]> {
    const wechatFileSavePath = await this.getWechatFileSavePath();
    const appletRootPath = path.join(wechatFileSavePath, "WeChat Files/Applet");
    const appidList = globSync(["wx*"], { cwd: appletRootPath });
    const miniprogramInfo = await Promise.all(
      appidList.map((it) => getPartialMiniprogramInfoByAppid(it))
    );

    return miniprogramInfo.map((it) => {
      const miniprogramPath = path.join(appletRootPath, it.appid);
      const wxapkgPaths = globSync(["**/*.wxapkg"], {
        cwd: miniprogramPath
      });

      return {
        ...it,
        path: miniprogramPath,
        wxapkgPaths: wxapkgPaths.map((it) => path.join(miniprogramPath, it))
      };
    });
  }

  async getWechatFileSavePath(): Promise<string> {
    const regKey = "HKCU\\SOFTWARE\\Tencent\\WeChat" as const;
    const regValues = await promisified.list([regKey]);
    const fileSavePath = regValues[regKey].values?.FileSavePath?.value as
      | string
      | undefined;

    if (fileSavePath) {
      return fileSavePath;
    }

    return path.join(os.homedir(), "Documents");
  }
}
