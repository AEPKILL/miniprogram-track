/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 10:30:51
 */

import * as babel from "@babel/core";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

export type WxmlRenderInfoRecord = Record<string, WxmlRenderInfo>;

export type WxmlRenderInfo = {
  renderFunctionName: string;
  renderFunctionCode: string;
  opsFunctionName: string;
  opsFunctionCode: string;
  opsArray: OpsArray;
  xArray: string[];
  defines: Record<string, Record<string, any>>;
  entrys: Record<string, any>;
  fileName: string;
  templateName?: string;
};

export type FunctionName = string;
export type FunctionRecord = Record<
  FunctionName,
  {
    code: string;
  }
>;

export type OpsArray = Array<string | number | OpsArray>;

export class WxmlCodeParser {
  parse(ast: babel.ParseResult): WxmlRenderInfoRecord {
    let wxmlRecord: WxmlRenderInfoRecord = {};

    traverse(ast, {
      AssignmentExpression: (path) => {
        if (
          /\$gwx\d*$|\$gwx\d*_[A-Za-z_0-9]+/.test(
            (path.node.left as babel.types.Identifier).name
          )
        ) {
          wxmlRecord = {
            ...wxmlRecord,
            ...this.getWxmRenderFunctionRecordInScope(path)
          };
        }
      }
    });

    return wxmlRecord;
  }

  getWxmRenderFunctionRecordInScope(
    scopePath: babel.NodePath
  ): WxmlRenderInfoRecord {
    const wxmlRecord: WxmlRenderInfoRecord = {};
    const xArray = this.getXArrayInScope(scopePath);
    const mFunctionRecord = this.getMFunctionRecordInScope(scopePath);
    const opsFunctionRecord = this.getOpsFunctionRecord(scopePath);
    const defines: Record<string, Record<string, any>> = {};
    const entrys: Record<string, any> = {};

    function getEntrysArrayElement(
      element: babel.types.Expression | babel.types.PatternLike
    ): unknown {
      if (element.type === "Identifier") {
        return element.name;
      }
      if (element.type === "ArrayExpression") {
        return element.elements.map((it2) => {
          if (it2?.type === "MemberExpression") {
            if (
              it2.object.type === "Identifier" &&
              it2.object.name === "x" &&
              it2.property.type === "NumericLiteral"
            ) {
              return xArray[it2.property.value];
            }
          }
          return "getEntrysArrayElement: unknown of  elements";
        });
      }
      return "getEntrysArrayElement: unknown";
    }

    scopePath.traverse({
      AssignmentExpression: (path) => {
        // d_[x[0]]['xxxxxxx'] = function() {}
        if (
          path.node.left.type === "MemberExpression" &&
          path.node.left.object.type === "MemberExpression" &&
          path.node.left.object.object.type === "Identifier" &&
          path.node.left.object.object.name === "d_" &&
          path.node.left.object.property.type === "MemberExpression" &&
          path.node.left.object.property.object.type === "Identifier" &&
          path.node.left.object.property.object.name === "x" &&
          path.node.right.type === "FunctionExpression"
        ) {
          const index = (
            path.node.left.object.property
              .property as babel.types.NumericLiteral
          ).value;
          const fileName = xArray[index];
          const renderFunctionName = `_x${index}`;
          const templateName = (
            path.node.left.property as babel.types.StringLiteral
          ).value;

          path.node.right.id = {
            type: "Identifier",
            name: renderFunctionName
          };

          const renderFunctionCode = generate(path.node.right).code;
          const opsFunctionName =
            this.getOpsFunctionNameByRenderCode(renderFunctionCode);
          const opsFunctionCode = opsFunctionRecord[opsFunctionName]?.code;

          defines[fileName] = {
            ...defines[fileName]
          };
          defines[fileName][
            (path.node.left.property as babel.types.StringLiteral).value
          ] = renderFunctionName;

          if (fileName && opsFunctionName && opsFunctionCode) {
            wxmlRecord[fileName] = {
              templateName,
              fileName,
              renderFunctionName,
              renderFunctionCode,
              opsFunctionName,
              opsFunctionCode,
              xArray,
              defines,
              entrys,
              opsArray: this.getOpsArray(opsFunctionName, opsFunctionCode)
            };
          }
        }

        // e_[x[0]] = { f: m0, j: [], i: [], ti: [], ic: [] };
        if (
          path.node.left.type === "MemberExpression" &&
          path.node.left.object.type === "Identifier" &&
          path.node.left.object.name === "e_" &&
          path.node.left.property.type === "MemberExpression" &&
          path.node.left.property.object.type === "Identifier" &&
          path.node.left.property.object.name === "x" &&
          path.node.right.type === "ObjectExpression"
        ) {
          const index = (
            path.node.left.property.property as babel.types.NumericLiteral
          ).value;
          const fileName = xArray[index];
          const properties = (path.node.right.properties ||
            []) as babel.types.ObjectProperty[];
          const renderProperty = properties.find(
            (it) => (it.key as babel.types.Identifier).name === "f"
          ) as babel.types.Property;
          defines[fileName] = {
            ...defines[fileName]
          };

          entrys[fileName] = {
            ...entrys[fileName]
          };

          for (const it of properties) {
            entrys[fileName][(it.key as babel.types.Identifier).name] =
              getEntrysArrayElement(it.value);
          }

          if (
            renderProperty &&
            fileName &&
            !(defines[fileName] && Object.keys(defines[fileName]).length)
          ) {
            if (renderProperty.value?.type === "Identifier") {
              const renderFunctionName = renderProperty.value.name;
              const renderFunctionCode =
                mFunctionRecord[renderFunctionName]?.code;
              const opsFunctionName =
                this.getOpsFunctionNameByRenderCode(renderFunctionCode);
              const opsFunctionCode = opsFunctionRecord[opsFunctionName].code;

              if (renderFunctionCode && opsFunctionCode) {
                wxmlRecord[fileName] = {
                  fileName,
                  renderFunctionName,
                  renderFunctionCode,
                  opsFunctionName,
                  xArray,
                  defines,
                  entrys,
                  opsFunctionCode: opsFunctionCode,
                  opsArray: this.getOpsArray(opsFunctionName, opsFunctionCode)
                };
              }
            }
          }
        }
      }
    });

    return wxmlRecord;
  }

  getXArrayInScope(scopePath: babel.NodePath): string[] {
    let xArray: string[] = [];
    scopePath.traverse({
      FunctionDeclaration(path) {
        path.skip();
      },
      VariableDeclarator(path) {
        if (
          (path.node.id as babel.types.Identifier).name === "x" &&
          path.node.init?.type == "ArrayExpression"
        ) {
          xArray = path.node.init.elements.map(
            (it) => (it as babel.types.StringLiteral).value
          );
        }
      }
    });
    return xArray;
  }

  getOpsFunctionRecord(scopePath: babel.NodePath): FunctionRecord {
    const opsFunctionRecord: FunctionRecord = {};
    scopePath.traverse({
      FunctionDeclaration(path) {
        const optsFunctionNameRE = /gz\$gwx\d*_([A-Za-z_0-9]+)/;
        const functionName = path.node.id?.name || "";
        const matched = functionName.match(optsFunctionNameRE);
        if (matched && matched[1] != null) {
          opsFunctionRecord[functionName] = {
            code: generate(path.node).code
          };
        }
      }
    });
    return opsFunctionRecord;
  }

  getMFunctionRecordInScope(scopePath: babel.NodePath): FunctionRecord {
    const renderFunctionRecord: FunctionRecord = {};
    const mFunctionNameRe = /m\d+/;
    scopePath.traverse({
      FunctionDeclaration(path) {
        path.skip();
      },
      VariableDeclarator(path) {
        const id = path.node.id as babel.types.Identifier;
        const init = path.node.init;
        if (
          mFunctionNameRe.test(id.name) &&
          init?.type == "FunctionExpression"
        ) {
          init.id = {
            type: "Identifier",
            name: id.name
          };
          renderFunctionRecord[id.name] = {
            code: generate(init).code
          };
        }
      }
    });

    return renderFunctionRecord;
  }

  getOpsFunctionNameByRenderCode(code: string): string {
    let opsFunctionName = "";

    traverse(babel.parse(code)!, {
      VariableDeclarator(path) {
        if (
          path.parentPath?.parentPath?.parentPath?.parentPath?.type ===
          "Program"
        ) {
          const id = path.node.id as babel.types.Identifier;
          const init = path.node.init as babel.types.CallExpression;
          if (id.name === "z" && init?.type == "CallExpression") {
            opsFunctionName = (init.callee as babel.types.Identifier).name;
          }
        }
      }
    });

    return opsFunctionName;
  }

  getOpsArray(opsFunctionName: string, opsFunctionCode: string): OpsArray {
    const opsFunction = new Function(
      "__WXML_GLOBAL__",
      `${opsFunctionCode}; return ${opsFunctionName}();`
    );

    return opsFunction({
      ops_cached: {}
    });
  }
}
