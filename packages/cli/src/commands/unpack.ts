/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:16:37
 */

import { command, Command, metadata, option } from "clime";

import { CommandCommonOptions } from "@/clime/command-common-options.js";
import { RegisterService } from "@/decorators/register-service.decorator";
import { container, IUnPack } from "@miniprogram-track/shared";

class UnpackCommandOptions extends CommandCommonOptions {
  @option<string>({
    name: "pkgPath",
    description: "小程序包的路径",
    required: true
  })
  pkgPath!: string;
}

@command({
  description: "解包小程序"
})
export default class UnpackCommand extends Command {
  @RegisterService
  @metadata
  async execute(options: UnpackCommandOptions): Promise<any> {
    const { pkgPath } = options;

    await container.resolve(IUnPack).unpack({
      pkgPath
    });
  }
}
