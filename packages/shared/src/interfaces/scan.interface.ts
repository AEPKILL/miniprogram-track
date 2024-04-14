/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 14:32:36
 */

import { MiniprogramInfo } from "@/types/miniprogram-info.type";
import { createServiceIdentifier } from "husky-di";

export interface IScan {
  scan(): Promise<MiniprogramInfo[]>;
}

export const IScan = createServiceIdentifier<IScan>("IScan");
