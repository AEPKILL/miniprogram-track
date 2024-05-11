/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-16 10:58:42
 */

import { WxmlReverseEmulator } from "@/classes/wxml-reverse-emulator";
import { ReversePipeline } from "../_type";
import { WxmlCodeParser } from "@/classes/wxml-code-parser";

export const reverseWxml: ReversePipeline = ({
  appWxssParsed,
  restoreBundle
}) => {
  if (!appWxssParsed) {
    return;
  }

  const wxmlCodeParser = new WxmlCodeParser();
  const renderInfoRecord = wxmlCodeParser.parse(appWxssParsed);

  for (const it in renderInfoRecord) {
    const renderInfo = renderInfoRecord[it];
    const wxml = new WxmlReverseEmulator(renderInfo).getWxml();
    console.log(`renderFunctionName:`, it, renderInfo.renderFunctionName);
    console.log(wxml);

    restoreBundle.append({
      path: renderInfo.fileName,
      buffer: Buffer.from(wxml)
    });
  }
};
