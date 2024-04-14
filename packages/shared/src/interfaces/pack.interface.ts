/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 12:42:53
 */

import { createServiceIdentifier } from "husky-di";

export interface IPack {}

export const IPack = createServiceIdentifier<IPack>("IPack");
