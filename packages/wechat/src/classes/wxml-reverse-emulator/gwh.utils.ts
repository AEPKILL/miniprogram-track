/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-18 22:12:19
 */

export function $gwh(): {
  hn(obj: any, all?: boolean): "h" | "n";
  nh(obj: any, special?: any): { __value__: any; __wxspec__: any };
  rv(obj: any): any;
  hm(obj: any): boolean;
} {
  class X {
    hn(obj: any, all = false): "h" | "n" {
      if (typeof obj === "object") {
        let cnt = 0;
        let any1 = false;
        let any2 = false;
        for (const x in obj) {
          any1 ||= x === "__value__";
          any2 ||= x === "__wxspec__";
          cnt++;
          if (cnt > 2) break;
        }
        return cnt === 2 &&
          any1 &&
          any2 &&
          (all || obj.__wxspec__ !== "m" || this.hn(obj.__value__) === "h")
          ? "h"
          : "n";
      }
      return "n";
    }

    nh(obj: any, special: any = true): { __value__: any; __wxspec__: any } {
      return { __value__: obj, __wxspec__: special };
    }

    rv(obj: any): any {
      return this.hn(obj, true) === "n" ? obj : this.rv(obj.__value__);
    }

    hm(obj: any): boolean {
      if (typeof obj === "object") {
        let cnt = 0;
        let any1 = false;
        let any2 = false;
        for (const x in obj) {
          any1 ||= x === "__value__";
          any2 ||= x === "__wxspec__";
          cnt++;
          if (cnt > 2) break;
        }
        return (
          cnt === 2 &&
          any1 &&
          any2 &&
          (obj.__wxspec__ === "m" || this.hm(obj.__value__))
        );
      }
      return false;
    }
  }

  return new X();
}
