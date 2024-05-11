/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 22:12:19
 */

import * as babel from "@babel/core";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

import { WxmlRenderInfo } from "../wxml-code-parser";
import { WxmlNode, WxmlTagEnum } from "../wxml-node";
import { $gwt } from "./rev.utils";
import { $gwh } from "./gwh.utils";
import { wrapScope } from "./common.utils";

export class WxmlReverseEmulator {
  renderFunctionAst: babel.ParseResult;

  constructor(readonly renderInfo: WxmlRenderInfo) {
    const { renderFunctionCode } = renderInfo;
    this.renderFunctionAst = babel.parse(renderFunctionCode)!;
    traverse(this.renderFunctionAst, {
      IfStatement(path) {
        const { test } = path.node;

        // 去除掉模板递归渲染的检查
        if (
          t.isMemberExpression(test) &&
          t.isIdentifier(test.object, { name: "p_" }) &&
          t.isIdentifier(test.property, { name: "b" })
        ) {
          path.remove();
          return;
        }

        const statements: babel.types.CallExpression[] = [];
        let current: babel.types.Statement | null | undefined = path.node;

        while (current) {
          const { type } = current;

          switch (type) {
            case "IfStatement": {
              const { test, consequent } = current;
              statements.push(
                t.callExpression(
                  t.callExpression(
                    t.identifier(current == path.node ? "_$If" : "_$ElseIf"),
                    [test]
                  ),
                  [
                    t.arrowFunctionExpression(
                      [],
                      consequent as babel.types.BlockStatement
                    )
                  ]
                )
              );
              current = current.alternate;
              break;
            }
            case "BlockStatement": {
              statements.push(
                t.callExpression(t.callExpression(t.identifier("_$Else"), []), [
                  t.arrowFunctionExpression([], current)
                ])
              );
            }
            default: {
              current = null;
            }
          }
        }

        path.replaceWithMultiple(statements);
      }
    });
  }

  getWxmlNode(): WxmlNode {
    const root = this.renderInfo.templateName
      ? new WxmlNode(WxmlTagEnum.template, null, {
          name: this.renderInfo.templateName
        })
      : new WxmlNode(WxmlTagEnum.block);
    const code = generate(this.renderFunctionAst).code;
    const wh = $gwh();
    const grb = $gwt();
    const gra = $gwt();

    function $gdc(o: any, p?: string, r?: number): any {
      const rv = o;
      if (rv === null || rv === undefined) return rv;
      if (
        typeof rv === "string" ||
        typeof rv === "boolean" ||
        typeof rv === "number"
      ) {
        return rv;
      }

      if (rv.constructor === Object) {
        const copy = {} as any;
        for (const k in rv as any) {
          if (Object.prototype.hasOwnProperty.call(rv, k)) {
            const key = p ? `${p}${k}` : k.substring(3);
            copy[key] = $gdc(rv[k], p, r);
          }
        }
        return copy;
      }

      if (rv.constructor === Array) {
        const copy = [] as any;
        for (let i = 0; i < rv.length; i++) {
          copy.push($gdc(rv[i], p, r));
        }
        return copy;
      }

      if (rv.constructor === Date) {
        const copy = new Date();
        copy.setTime(rv.getTime());
        return copy;
      }

      if (rv.constructor === RegExp) {
        let flags = "";
        if (rv.global) flags += "g";
        if (rv.ignoreCase) flags += "i";
        if (rv.multiline) flags += "m";
        return new RegExp(rv.source, flags);
      }

      if (r && typeof rv === "function") {
        if (r === 1) return $gdc(rv(), undefined, 2);
        if (r === 2) return rv;
      }

      return null as unknown;
    }

    const wfor = (
      to_iter: any,
      func: Function,
      env: any,
      _s: any,
      global: any,
      father: WxmlNode,
      itemname: any,
      indexname: any,
      keyname: any
    ) => {
      const block = new WxmlNode(WxmlTagEnum.block, null, {
        "wx:for": `{{${to_iter}}}`,
        "wx:for-item": itemname,
        "wx:for-index": indexname
      });
      block.appendChild(
        new WxmlReverseEmulator({
          ...this.renderInfo,
          renderFunctionName: "wxFor",
          renderFunctionCode: func
            .toString()
            .replace(/function\s*\(/, "function wxFor("),
          templateName: void 0
        }).getWxmlNode()
      );
      father.appendChild(block);
    };

    const context = {
      e: this.renderInfo.entrys,
      e_: this.renderInfo.entrys,
      d_: this.renderInfo.defines,
      // scope
      s: {},
      // root
      r: root,
      z: this.renderInfo.opsArray,
      // global
      gg: {},
      x: this.renderInfo.xArray,
      [this.renderInfo.opsFunctionName]: () => {
        return this.renderInfo.opsArray;
      },
      // global.modules
      f_: {},
      p_: {},
      _(parent: WxmlNode, child: WxmlNode) {
        parent.appendChild(child);
      },
      _v() {
        return new WxmlNode(WxmlTagEnum.block);
      },
      _n(tag: string) {
        return new WxmlNode(tag);
      },
      _$If(condition: string) {
        const ifBlock = new WxmlNode(WxmlTagEnum.block);
        ifBlock.attrs["wx:if"] = wrapScope(condition.toString());
        WxmlNode.currentIfBlock = ifBlock;

        return function (block: () => void) {
          block();
        };
      },
      _$elseIf: (condition: string) => {
        const elseIfBlock = new WxmlNode(WxmlTagEnum.block);
        elseIfBlock.attrs["wx:elif"] = wrapScope(condition.toString());
        WxmlNode.currentIfBlock = elseIfBlock;

        return function (block: () => void) {
          block();
        };
      },
      _$else() {
        const elseBlock = new WxmlNode(WxmlTagEnum.block);
        elseBlock.attrs["wx:else"] = "";
        WxmlNode.currentIfBlock = elseBlock;

        return function (block: () => void) {
          block();
        };
      },
      wh,
      $gdc,
      _da(
        node: WxmlNode,
        attrname: string,
        _opindex: number,
        raw: string,
        _o: any
      ) {
        node.attrs[attrname] = $gdc(raw, "", 2);
      },
      _rz(
        z: any[],
        node: WxmlNode,
        attrname: string,
        opindex: number,
        env: any,
        scope: any,
        global: { opindex?: number }
      ): void {
        global.opindex = opindex;
        const o: {} = {};
        const a = grb(z[opindex], env, scope, global, o);

        context._da(node, attrname, opindex, `${a}`, o);
      },
      _mz(
        z: any[],
        tag: string,
        attrs: Array<string>,
        generics: Array<string>,
        env: any,
        scope: any,
        global: any
      ): any {
        const tmp = context._n(tag);
        let base = 0;

        for (let i = 0; i < attrs.length; i += 2) {
          if (base + Number(attrs[i + 1]) < 0) {
            tmp.attrs[attrs[i]] = true;
          } else {
            context._rz(
              z,
              tmp,
              attrs[i],
              Number(base + attrs[i + 1]),
              env,
              scope,
              global
            );
            if (base === 0) base = Number(attrs[i + 1]);
          }
        }

        for (let i = 0; i < generics.length; i += 2) {
          if (base + Number(generics[i + 1]) < 0) {
            tmp.attrs[generics[i]] = "";
          } else {
            let $t = grb(z[base + Number(generics[i + 1])], env, scope, global);
            if ($t !== "") {
              $t = "wx-" + $t;
            }
            tmp.attrs[generics[i]] = $t;
            if (base === 0) base = Number(generics[i + 1]);
          }
        }
        return tmp;
      },
      _ai(i: any, p: any, e: any, me: any, r: any, c: any) {
        const x = context._grp(p, e, me);
        if (x) {
          root.appendChild(
            new WxmlNode("import", root, {
              src: x
            })
          );
        }
      },
      _gd(p: string, c: string, e: any, d: any) {
        const node = new WxmlNode("template", null, {
          is: c
        });

        return function (
          data: string | object,
          data2: string,
          parent: WxmlNode
        ) {
          node.attrs["data"] =
            typeof data === "object" ? wrapScope(JSON.stringify(data)) : data;

          parent.appendChild(node);
        };
      },

      _1: (
        opindex: number,
        env: any,
        scope: any,
        global: any,
        o?: any
      ): any => {
        o = o || {};
        global.opindex = opindex;
        return gra(this.renderInfo.opsArray[opindex], env, scope, global, o);
      },

      _1z(
        z: any[],
        opindex: number,
        env: any,
        scope: any,
        global: any,
        o?: any
      ): any {
        o = o || {};
        global.opindex = opindex;
        return gra(z[opindex], env, scope, global, o);
      },

      _2(
        opindex: any,
        func: any,
        env: any,
        scope: any,
        global: any,
        father: any,
        itemname: any,
        indexname: any,
        keyname: any
      ) {
        const o: {} = {};
        const to_iter = context._1(opindex, env, scope, global);
        wfor(
          to_iter,
          func,
          env,
          scope,
          global,
          father,
          itemname,
          indexname,
          keyname
        );
      },
      _2z(
        z: any,
        opindex: any,
        func: any,
        env: any,
        scope: any,
        global: any,
        father: any,
        itemname: any,
        indexname: any,
        keyname: any
      ) {
        const o: {} = {};
        const to_iter = context._1z(z, opindex, env, scope, global);

        wfor(
          to_iter,
          func,
          env,
          scope,
          global,
          father,
          itemname,
          indexname,
          keyname
        );
      },
      _oz(
        z: any[],
        opindex: number,
        env: any,
        scope: any,
        global: { opindex?: number }
      ): any {
        global.opindex = opindex;
        const nothing = {};

        const r: any = grb(z[opindex], env, scope, global, nothing);

        return r;
      },
      _grp(
        p: string,
        e: { [key: string]: any },
        me: string
      ): string | undefined {
        if (p[0] !== "/") {
          const mepart = me.split("/").slice(0, -1);
          const ppart = p.split("/");
          for (let i = 0; i < ppart.length; i++) {
            if (ppart[i] === "..") {
              mepart.pop();
            } else if (!ppart[i] || ppart[i] === ".") {
              continue;
            } else {
              mepart.push(ppart[i]);
            }
          }
          p = mepart.join("/");
        }

        if (me.startsWith(".") && p.startsWith("/")) {
          p = "." + p;
        }

        return e[p] ? p : e[p + ".wxml"] ? p + ".wxml" : undefined;
      }
    };

    console.log(this.renderInfo.renderFunctionName, `START`);

    new Function(
      ...Object.keys(context),
      `${code}; 
      return ${this.renderInfo.renderFunctionName}(e, s, r, gg)`
    )(...Object.values(context)) as null | WxmlNode;

    return root;
  }

  getWxml(): string {
    const wxmlNode = this.getWxmlNode();
    if (wxmlNode.tag === WxmlTagEnum.block) {
      return wxmlNode
        .optimize()
        .children.map((it) =>
          it instanceof WxmlNode ? it.optimize().toWxml() : it
        )
        .join("\n");
    }
    return wxmlNode.optimize().toWxml();
  }
}
