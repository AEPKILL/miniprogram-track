/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:16:37
 */

import { command, Command, metadata } from "clime";
import chalk from "chalk";

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

    for (const item of miniprogramInfoArray) {
      if (item.wxapkgPaths.length === 0) {
        continue;
      }

      console.log(`${chalk.green("appid")}: ${item.appid}`);
      console.log(`  名称: ${item.name || "未知"}`);
      console.log(`  开发者: ${item.author || "未知"}`);
      console.log(`  miniprogramDir: ${item.miniprogramDir}`);
      console.log(`  wxapkgPaths:`);
      for (const path of item.wxapkgPaths) {
        console.log(`    ${path}`);
      }

      const isLastItem =
        item.appid ==
        miniprogramInfoArray[miniprogramInfoArray.length - 1].appid;
      if (!isLastItem) {
        console.log(chalk.yellow("-".repeat(100)));
      }
    }
  }
}
