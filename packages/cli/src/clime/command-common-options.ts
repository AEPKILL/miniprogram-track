/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 14:49:37
 */

import { ExpectedError, option, Options } from "clime";

import { displayEnum, valueInEnum } from "@/utils/enum.utils";
import {
  ICommandCommonOptions,
  MiniprogramTypeEnum,
  PlatformEnum
} from "@miniprogram-track/shared";

export class CommandCommonOptions
  extends Options
  implements ICommandCommonOptions
{
  @option<string>({
    name: "type",
    description: "小程序类型",
    default: MiniprogramTypeEnum.wechat,
    validator(value: string) {
      if (!valueInEnum(MiniprogramTypeEnum, value)) {
        throw new ExpectedError(
          `不支持小程序类型 ${value}, 可选的类型: ${displayEnum(
            MiniprogramTypeEnum
          )}`
        );
      }
    }
  })
  type!: string;

  @option<string>({
    name: "platform",
    description: "平台",
    default: PlatformEnum.windows,
    validator(value) {
      if (!valueInEnum(PlatformEnum, value)) {
        throw new ExpectedError(
          `不支持平台 ${value}, 可选的平台: ${displayEnum(PlatformEnum)}`
        );
      }
    }
  })
  platform!: string;
}
