/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-16 10:58:42
 */

import { ReversePipeline } from "../_type";
import path from "path";

type MarkupOptions = {
  suffix: string;
  path: string;
};

function makeup(file: Array<string | any[]>, opt: MarkupOptions): string {
  let res = "";
  const ex = file;
  for (let i = ex.length - 1; i >= 0; i--) {
    const content = ex[i];
    if (Array.isArray(content)) {
      const op = content[0];
      if (op == 0) {
        res = content[1] + "rpx" + res;
      } else if (op == 1) {
        res = opt.suffix + res;
      } else if (op == 2) {
        res = `@import "${path.posix.relative(opt.path, content[1])}"; ${res}`;
      }
    } else {
      res = content + res;
    }
  }
  return res.replace(/body\s*{/g, "page{");
}

export const reverseWxss: ReversePipeline = ({
  originalBundle,
  restoreBundle
}) => {
  const appWxss = originalBundle.get("app-wxss.js");
  if (!appWxss) {
    console.warn("app-service.js not found, skip reverse wxss source");
    return;
  }
  const wxssContent = appWxss.buffer
    .toString()
    .replace(/var\s*setCssToHead\s*=/, "var setCssToHead2 =")
    .replace(
      /var\s*__COMMON_STYLESHEETS__\s*=/,
      "var __COMMON_STYLESHEETS__2 ="
    );

  new Function("__COMMON_STYLESHEETS__", "setCssToHead", "window", wxssContent)(
    new Proxy(
      {},
      {
        set(target, p, value, receiver) {
          if (typeof p === "string") {
            restoreBundle.append({
              path: p,
              buffer: Buffer.from(
                makeup(value, {
                  suffix: "",
                  path: path.parse(p).dir
                })
              )
            });
          }

          return Reflect.set(target, p, value, receiver);
        }
      }
    ),
    function (
      file: Array<string | number[]>,
      _xcInvalid: any,
      info: { path: string }
    ) {
      if (info && info.path) {
        restoreBundle.append({
          path: info.path,
          buffer: Buffer.from(
            makeup(file, {
              suffix: "",
              path: path.parse(info.path).dir
            })
          )
        });
      }

      return function () {};
    },
    {
      screen: {}
    }
  );
};
