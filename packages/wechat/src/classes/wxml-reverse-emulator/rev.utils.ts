/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 22:12:19
 */

import { BracketTypeEnum, wrapBracket, wrapScope } from "./common.utils";

export function $gwt() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function rev(ops: any, _e?: any, _s?: any, _g?: any, _o?: any): any {
    return rev2(ops);
  };

  function toScopeJson(value: any): string {
    if (value instanceof RegExp) {
      return value.source;
    } else if (Array.isArray(value)) {
      return wrapBracket(
        value.map((it) => toScopeJson(it)).join(","),
        BracketTypeEnum.bracket
      );
    } else if (value != null && typeof value === "object") {
      return wrapBracket(
        Object.entries(value)
          .map(([key, value]) => `${key}:${toScopeJson(value)}`)
          .join(","),
        BracketTypeEnum.braces
      );
    } else {
      return JSON.stringify(value);
    }
  }

  // function getOperatorPrior(op: string, len: number): number {
  //   switch (op) {
  //     case "?:":
  //       return 4;
  //     case "&&":
  //       return 6;
  //     case "||":
  //       return 5;
  //     case "*":
  //       return 14;
  //     case "/":
  //       return 14;
  //     case "%":
  //       return 14;
  //     case "|":
  //       return 7;
  //     case "^":
  //       return 8;
  //     case "&":
  //       return 9;
  //     case "!":
  //     case "~":
  //       return 16;
  //     case "===":
  //     case "==":
  //     case "!=":
  //     case "!==":
  //       return 10;
  //     case ">=":
  //     case "<=":
  //     case ">":
  //     case "<":
  //       return 11;
  //     case "<<":
  //     case ">>":
  //       return 12;
  //     case "+":
  //     case "-":
  //       return len === 3 ? 13 : 16;
  //     default:
  //       return 0;
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getArithmetic(_ops: any[]): string {
    return `getArithmetic`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function rev2(ops: any[], scope = false): string {
    const op = ops[0];
    let result = "";

    if (typeof op === "object") {
      const vop = op[0];
      switch (vop) {
        // arithmetic
        case 2: {
          result = getArithmetic(ops);
          break;
        }
        case 4: {
          result = rev2(ops[1], scope);
          break;
        }
        case 5: {
          switch (ops.length) {
            case 2: {
              result = wrapBracket(rev2(ops[1]), BracketTypeEnum.bracket);
              break;
            }
            case 1: {
              result = `[]`;
              break;
            }
            default: {
              const a = rev2(ops[1]);
              const b = rev2(ops[2]);
              result = `[${a.replace(/^\[/, "").replace(/\]$/, "")}, ${b.replace(/^\[/, "").replace(/\]$/, "")}]`;
              break;
            }
          }
        }
        case 6: {
          const a = rev2(ops[1]);

          if (a === null || a === undefined) {
            result = "undefined";
            break;
          }

          const b = rev2(ops[2]);
          if (
            b === null ||
            b === undefined ||
            b === "__proto__" ||
            b === "prototype" ||
            b === "caller"
          ) {
            result = `undefined`;
            break;
          }

          if (/^[A-Za-z\_][A-Za-z\d\_]*$/.test(b)) {
            result = wrapScope(`${a}.${b}`);
            break;
          }

          result = wrapScope(`${a}[${b}]`);
          break;
        }
        case 7: {
          switch (ops[1][0]) {
            case 11:
              result = `{global: true}`;
              break;
            case 3:
              result = rev2(ops[1]);
              break;
            case 8: {
              const a = rev2(ops[1]);
              const b = rev2(ops[2]);
              result = `${a} : ${b}`;
              break;
            }
            case 9: {
              const a = rev2(ops[1]);
              const b = rev2(ops[2]);

              result = wrapBracket(`...${a}, ...${b}`, BracketTypeEnum.braces);
              break;
            }
            case 10: {
              result = rev2(ops[1]);
              break;
            }
            case 12: {
              const a = rev2(ops[1]);
              const b = rev2(ops[2]);
              result = `${a}.apply(null, ${b})`;
              break;
            }
          }
        }
      }
    } else {
      if (op === 1) {
        result = wrapScope(toScopeJson(ops[1]));
      } else if (op === 3) {
        result = ops[1];
      } else if (op === 11) {
        let _a = "";
        for (let i = 1; i < ops.length; i++) {
          const xp = rev2(ops[i]);
          _a += typeof xp === "undefined" ? "" : xp;
        }
        result = _a;
      } else {
        console.warn(`Rev[0]: 未知的 op: ${op}`);
      }
    }

    if (result === "") return `unknown - -- ${JSON.stringify(ops)}`;

    return `${result}`;
  }
}
