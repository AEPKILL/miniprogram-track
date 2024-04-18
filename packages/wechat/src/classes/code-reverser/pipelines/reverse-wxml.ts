/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-16 10:58:42
 */

import { ReversePipeline } from "../_type";
import { WxmlCodeParser } from "@/classes/wxml-code-parser";

export const reverseWxml: ReversePipeline = ({ appWxssParsed }) => {
  if (!appWxssParsed) {
    return;
  }

  const wxmlCodeParser = new WxmlCodeParser();

  console.log(wxmlCodeParser.parse(appWxssParsed));
};
