/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 14:58:29
 */

import { FileBundle } from "../file-Bundle";

export function reverseAppJson(
  originalBundle: FileBundle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _restoreBundle: FileBundle
): void {
  const appConfigContent = originalBundle.get("/app-config.json");
  if (!appConfigContent) throw new Error("app-config.json not found");
  const appConfig = JSON.parse(appConfigContent.buffer.toString());

  console.log("app-config:", appConfig);
}
