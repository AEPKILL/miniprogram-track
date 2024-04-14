/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 18:04:40
 */

import { Command, ExpectedError } from "clime";
import { ValueProvider } from "husky-di";

import { throwExpectedError } from "@/utils/exception.utils";
import {
  container,
  ICommandCommonOptions,
  MiniprogramTypeEnum
} from "@miniprogram-track/shared";
import { registerService as registerWechatService } from "@miniprogram-track/wechat";

export const RegisterService = <T extends ICommandCommonOptions>(
  _target: Command,
  _key: string | symbol,
  descriptor: TypedPropertyDescriptor<(options: T) => any>
) => {
  const { value } = descriptor;
  return {
    ...descriptor,
    value(options: T) {
      const { type } = options;

      container.register(
        ICommandCommonOptions,
        new ValueProvider({
          useValue: options
        })
      );

      switch (type) {
        case MiniprogramTypeEnum.wechat: {
          throwExpectedError(() => registerWechatService(container, options));
          break;
        }
        default: {
          throw new ExpectedError(`不支持的小程序类型: ${type}`);
        }
      }

      return value!.apply(this, [options]);
    }
  };
};
