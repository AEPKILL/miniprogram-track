/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 22:00:38
 */

import { FileBundle } from "@/classes/file-bundle";
import * as babel from "@babel/core";
import { join } from "path";

import generator from "@babel/generator";
import traverse from "@babel/traverse";

import { ReversePipeline } from "../_type";

function reverseJsInBundleFromParsedResult(
  ast: babel.ParseResult,
  restoreBundle: FileBundle
): void {
  traverse(ast, {
    CallExpression(path) {
      const isDefineFunctionCall =
        (path.node.callee as babel.types.V8IntrinsicIdentifier).name ===
          "define" && path.parentPath?.parentPath?.type === "Program";
      if (isDefineFunctionCall) {
        const args = path.node.arguments;
        const functionContent = (args[1] as babel.types.FunctionExpression).body
          .body;
        const codes = functionContent.map((it) => generator(it).code);

        let fileName = (args[0] as babel.types.StringLiteral).value;
        if (fileName.startsWith("/__plugin__") && !fileName.endsWith(".js")) {
          fileName = join(fileName, "index.js");
        }

        restoreBundle.append({
          path: fileName,
          buffer: Buffer.from(codes.join("\n\n"))
        });
      }
    }
  });
}

export const reverseJs: ReversePipeline = ({
  appServiceParsed,
  gameParsed,
  workersParsed,
  restoreBundle
}) => {
  if (appServiceParsed) {
    reverseJsInBundleFromParsedResult(appServiceParsed, restoreBundle);
  }
  if (gameParsed) {
    reverseJsInBundleFromParsedResult(gameParsed, restoreBundle);
  }
  if (workersParsed) {
    reverseJsInBundleFromParsedResult(workersParsed, restoreBundle);
  }
};
