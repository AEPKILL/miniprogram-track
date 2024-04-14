/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:00:02
 */

import { ClassProvider, IContainer, LifecycleEnum } from "husky-di";

import { PackWindowsService } from "@/services/pack-windows.service";
import { ScanWindowsService } from "@/services/scan-windows.service";
import { UnpackWindowsService } from "@/services/unpack-windows.service";
import {
  ICommandCommonOptions,
  IPack,
  IScan,
  IUnPack,
  PlatformEnum
} from "@miniprogram-track/shared";

export function registerService(
  container: IContainer,
  options: ICommandCommonOptions
): void {
  const { platform } = options;

  switch (platform) {
    case PlatformEnum.windows: {
      container.register(
        IScan,
        new ClassProvider({
          lifecycle: LifecycleEnum.singleton,
          useClass: ScanWindowsService
        })
      );
      container.register(
        IPack,
        new ClassProvider({
          lifecycle: LifecycleEnum.singleton,
          useClass: PackWindowsService
        })
      );
      container.register(
        IUnPack,
        new ClassProvider({
          lifecycle: LifecycleEnum.singleton,
          useClass: UnpackWindowsService
        })
      );
      break;
    }

    default: {
      throw new Error(`unsupported platform: ${platform}`);
    }
  }
}
