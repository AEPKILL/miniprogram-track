/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 10:30:51
 */

import * as babel from "@babel/core";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

export type WxmlRenderFunctionRecord = Record<
  string,
  {
    renderCode: string;
    opsCode: string;
  }
>;

export type FunctionName = string;
export type FunctionRecord = Record<
  FunctionName,
  {
    code: string;
  }
>;

export class WxmlCodeParser {
  parse(ast: babel.ParseResult): WxmlRenderFunctionRecord {
    let wxmlRecord: WxmlRenderFunctionRecord = {};

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
  ): WxmlRenderFunctionRecord {
    const wxmlRecord: WxmlRenderFunctionRecord = {};
    const xArray = this.getXArrayInScope(scopePath);
    const mFunctionRecord = this.getMFunctionRecordInScope(scopePath);
    const opsFunctionRecord = this.getOpsFunctionRecord(scopePath);
    const defined = new Set<number | string>();

    scopePath.traverse({
      AssignmentExpression: (path) => {
        // _d[x[0]]['xxxxxxx'] = function() {}
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

          path.node.right.id = {
            type: "Identifier",
            name: `_x${index}`
          };

          const renderCode = generate(path.node.right).code;
          const opsName = this.getOpsFunctionNameByCode(renderCode);
          const opsCode = opsFunctionRecord[opsName]?.code;

          if (fileName && opsName && opsCode && !defined.has(index)) {
            defined.add(index);
            wxmlRecord[fileName] = {
              renderCode,
              opsCode
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
          const renderProperty = (path.node.right.properties || []).find(
            (it) =>
              ((it as babel.types.Property).key as babel.types.Identifier)
                .name === "f"
          ) as babel.types.Property;

          if (renderProperty && fileName && !defined.has(index)) {
            if (renderProperty.value?.type === "Identifier") {
              const renderFunctionName = renderProperty.value.name;
              const renderCode = mFunctionRecord[renderFunctionName]?.code;
              const opsName = this.getOpsFunctionNameByCode(renderCode);
              const opsCode = opsFunctionRecord[opsName].code;
              if (renderCode && opsCode) {
                wxmlRecord[fileName] = {
                  renderCode,
                  opsCode
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

  getOpsFunctionNameByCode(code: string): string {
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
}
