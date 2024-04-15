/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:16:37
 */

import { command, Command, ExpectedError, metadata, option } from "clime";
import ora from "ora";

import { CommandCommonOptions } from "@/clime/command-common-options.js";
import { RegisterService } from "@/decorators/register-service.decorator";
import { container, IUnPack, UnpackOptions } from "@miniprogram-track/shared";

class UnpackCommandOptions
  extends CommandCommonOptions
  implements UnpackOptions
{
  @option<string>({
    name: "appid",
    description: "appid",
    required: true
  })
  appid!: string;

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

  @option<string>({
    name: "targetDir",
    description: "解包目标目录"
  })
  targetDir?: string;

  @option<boolean>({
    name: "restoreCode",
    description: "是否尝试还原原始代码结构",
    default: true,
    toggle: true
  })
  restoreCode?: boolean;
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

    const spinner = ora({
      discardStdin: false
    });

    spinner.text = "解包中...";
    spinner.start();
    try {
      const unpackInfo = await container.resolve(IUnPack).unpack(options);
      spinner.text = `解包完成，解包文件到: ${unpackInfo.path}`;
      spinner.succeed();
    } catch (e: any) {
      spinner.text = `解包识别: ${e.message || "未知原因"}`;
      spinner.fail();
    }
  }
}
