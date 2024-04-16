/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 22:00:38
 */

import { ReversePipeline } from "../_type";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

export const reverseJs: ReversePipeline = ({
  originalBundle,
  restoreBundle
}) => {
  const appService = originalBundle.get("app-service.js");
  if (!appService) {
    console.warn("app-service.js not found, skip reverse javascript source");
    return;
  }

  const appServiceContent = appService.buffer.toString();
  const ast = babel.parse(appServiceContent)!;

  traverse(ast, {
    CallExpression(path) {
      if (
        (path.node.callee as babel.types.V8IntrinsicIdentifier).name ===
          "define" &&
        path.parentPath.type === "ExpressionStatement"
      ) {
        const args = path.node.arguments;
        const fileName = (args[0] as babel.types.StringLiteral).value;
        const functionContent = (args[1] as babel.types.FunctionExpression).body
          .body;
        const codes = functionContent.map((it) => generator(it).code);

        restoreBundle.append({
          path: fileName,
          buffer: Buffer.from(codes.join("\n\n"))
        });
      }
    }
  });
};
