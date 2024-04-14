/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:16:37
 */

import { command, Command, ExpectedError, metadata, option } from "clime";

import { CommandCommonOptions } from "@/clime/command-common-options.js";
import { RegisterService } from "@/decorators/register-service.decorator";
import { container, IUnPack, UnpackOptions } from "@miniprogram-track/shared";

class UnpackCommandOptions
  extends CommandCommonOptions
  implements UnpackOptions
{
  @option<string>({
    name: "pkgPath",
    description: "小程序包的路径"
  })
  pkgPath?: string;

  @option<string>({
    name: "miniprogramDir",
    description: "小程序目录"
  })
  miniprogramDir?: string;
}

@command({
  description: "解包小程序"
})
export default class UnpackCommand extends Command {
  @RegisterService
  @metadata
  async execute(options: UnpackCommandOptions): Promise<any> {
    const { pkgPath, miniprogramDir } = options;

    if (!pkgPath && !miniprogramDir) {
      throw new ExpectedError(`请输入  --pkgPath 或 --miniprogramDir 参数`);
    }

    await container.resolve(IUnPack).unpack({
      pkgPath,
      miniprogramDir
    });
  }
}
