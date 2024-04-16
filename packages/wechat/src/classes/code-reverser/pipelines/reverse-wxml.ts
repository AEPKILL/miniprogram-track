/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 22:00:38
 */

import { ReversePipeline } from "../_type";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

export const reverseWxml: ReversePipeline = ({ originalBundle }) => {
  const appService = originalBundle.get("app-service.js");
  if (!appService) {
    console.warn("app-service.js not found, skip reverse javascript source");
    return;
  }

  const appServiceContent = appService.buffer.toString();
  const ast = babel.parse(appServiceContent)!;

  traverse(ast, {
    CallExpression(path) {
      console.log(path);
    }
  });
};
