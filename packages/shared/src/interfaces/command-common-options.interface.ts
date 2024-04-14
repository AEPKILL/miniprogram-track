/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 15:01:52
 */

import { createServiceIdentifier } from "husky-di";

export interface ICommandCommonOptions {
  type: string;
  platform: string;
}

export const ICommandCommonOptions =
  createServiceIdentifier<ICommandCommonOptions>("ICommandCommonOptions");
