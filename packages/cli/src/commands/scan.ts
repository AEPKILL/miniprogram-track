/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:16:37
 */

import { command, Command, metadata } from "clime";

import { CommandCommonOptions } from "@/clime/command-common-options.js";
import { RegisterService } from "@/decorators/register-service.decorator";
import { container, IScan } from "@miniprogram-track/shared";

@command({
  description: "扫描小程序"
})
export default class ScanCommand extends Command {
  @RegisterService
  @metadata
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_options: CommandCommonOptions): Promise<any> {
    const miniprogramInfoArray = await container.resolve(IScan).scan();

    console.log(miniprogramInfoArray);
  }
}
