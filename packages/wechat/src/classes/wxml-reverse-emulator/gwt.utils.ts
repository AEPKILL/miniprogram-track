// /**
//  * @overview
//  * @author AEPKILL
//  * @created 2024-04-18 22:12:19
//  */

// export function $gwrt(should_pass_type_info: boolean, $gdc: any, _ca: any) {
//   function ArithmeticEv(ops: any, e: any, s: any, g: any, o: any) {
//     const _f = false;
//     const rop = ops[0][1];
//     let _a, _b, _c, _d;
//     switch (rop) {
//       case "?:":
//         _a = rev(ops[1], e, s, g, o, _f);
//         _d = wh.rv(_a)
//           ? rev(ops[2], e, s, g, o, _f)
//           : rev(ops[3], e, s, g, o, _f);
//         return _d;
//         break;
//       case "&&":
//         _a = rev(ops[1], e, s, g, o, _f);
//         _d = rev(ops[2], e, s, g, o, _f);
//         _d = _c && _d;
//         return _d;
//         break;
//       case "||":
//         return rev(ops[1], e, s, g, o, _f) || rev(ops[2], e, s, g, o, _f);
//         break;
//       case "+":
//       case "*":
//       case "/":
//       case "%":
//       case "|":
//       case "^":
//       case "&":
//       case "===":
//       case "==":
//       case "!=":
//       case "!==":
//       case ">=":
//       case "<=":
//       case ">":
//       case "<":
//       case "<<":
//       case ">>":
//         _a = rev(ops[1], e, s, g, o, _f);
//         _b = rev(ops[2], e, s, g, o, _f);
//         switch (rop) {
//           case "+":
//             _d = _a + _b;
//             break;
//           case "*":
//             _d = _a * _b;
//             break;
//           case "/":
//             _d = _a / _b;
//             break;
//           case "%":
//             _d = _a % _b;
//             break;
//           case "|":
//             _d = _a | _b;
//             break;
//           case "^":
//             _d = _a ^ _b;
//             break;
//           case "&":
//             _d = _a & _b;
//             break;
//           case "===":
//             _d = _a === _b;
//             break;
//           case "==":
//             _d = _a == _b;
//             break;
//           case "!=":
//             _d = _a != _b;
//             break;
//           case "!==":
//             _d = _a !== _b;
//             break;
//           case ">=":
//             _d = _a >= _b;
//             break;
//           case "<=":
//             _d = _a <= _b;
//             break;
//           case ">":
//             _d = _a > _b;
//             break;
//           case "<":
//             _d = _a < _b;
//             break;
//           case "<<":
//             _d = _a << _b;
//             break;
//           case ">>":
//             _d = _a >> _b;
//             break;
//           default:
//             break;
//         }
//         return _d;
//         break;
//       case "-":
//         _a = ops.length === 3 ? rev(ops[1], e, s, g, o, _f) : 0;
//         _b =
//           ops.length === 3
//             ? rev(ops[2], e, s, g, o, _f)
//             : rev(ops[1], e, s, g, o, _f);
//         _d = _a - _b;
//         return _d;
//         break;
//       case "!":
//         _a = rev(ops[1], e, s, g, o, _f);

//         return !_a;
//       case "~":
//         _a = rev(ops[1], e, s, g, o, _f);
//         return ~_a;
//       default:
//         console.warn("unrecognized op" + rop);
//     }
//   }
//   function rev(ops: any, e: any, s: any, g: any, o: any, newap?: any): any {
//     const op = ops[0];
//     const _f = false;
//     if (typeof newap !== "undefined") o.ap = newap;
//     if (typeof op === "object") {
//       const vop = op[0];
//       let _a: any,
//         _aa: any,
//         _b: any,
//         _bb: any,
//         _d: any,
//         _s: any,
//         _e: any,
//         _ta: any,
//         _tb: any,
//         _td: any;
//       switch (vop) {
//         case 2:
//           return ArithmeticEv(ops, e, s, g, o);
//           break;
//         case 4:
//           return rev(ops[1], e, s, g, o, _f);
//           break;
//         case 5:
//           switch (ops.length) {
//             case 2:
//               _a = rev(ops[1], e, s, g, o, _f);
//               return [_a];
//               break;
//             case 1:
//               return [];
//               break;
//             default:
//               _a = rev(ops[1], e, s, g, o, _f);
//               _b = rev(ops[2], e, s, g, o, _f);
//               _a.push(_b);
//               return _a;
//               break;
//           }
//           break;
//         case 6:
//           _a = rev(ops[1], e, s, g, o);
//           let ap = o.ap;
//           _aa = _a;
//           if (should_pass_type_info) {
//             if (_aa === null || typeof _aa === "undefined") {
//               return undefined;
//             }
//             _b = rev(ops[2], e, s, g, o, _f);
//             _bb = _b;
//             o.ap = ap;
//             o.is_affected |= _tb;
//             if (
//               _bb === null ||
//               typeof _bb === "undefined" ||
//               _bb === "__proto__" ||
//               _bb === "prototype" ||
//               _bb === "caller"
//             ) {
//               return undefined;
//             }
//             _d = _aa[_bb];
//             if (typeof _d === "function" && !ap) _d = undefined;

//             return _d;
//           } else {
//             if (_aa === null || typeof _aa === "undefined") {
//               return undefined;
//             }
//             _b = rev(ops[2], e, s, g, o, _f);
//             _bb = _b;
//             o.ap = ap;
//             if (
//               _bb === null ||
//               typeof _bb === "undefined" ||
//               _bb === "__proto__" ||
//               _bb === "prototype" ||
//               _bb === "caller"
//             ) {
//               return undefined;
//             }
//             _d = _aa[_bb];
//             if (typeof _d === "function" && !ap) _d = undefined;
//             return _d;
//           }
//         case 7:
//           switch (ops[1][0]) {
//             case 11:
//               return g;
//             case 3:
//               _s = wh.rv(s);
//               _e = wh.rv(e);
//               _b = ops[1][1];
//               if (g && g.f && g.f.hasOwnProperty(_b)) {
//                 _a = g.f;
//                 o.ap = true;
//               } else {
//                 _a =
//                   _s && _s.hasOwnProperty(_b)
//                     ? s
//                     : _e && _e.hasOwnProperty(_b)
//                       ? e
//                       : undefined;
//               }
//               if (should_pass_type_info) {
//                 if (_a) {
//                   _ta = wh.hn(_a) === "h";
//                   _aa = _ta ? wh.rv(_a) : _a;
//                   _d = _aa[_b];
//                   _td = wh.hn(_d) === "h";
//                   o.is_affected |= _ta || _td;
//                   _d = _ta && !_td ? wh.nh(_d, "e") : _d;
//                   return _d;
//                 }
//               } else {
//                 if (_a) {
//                   _ta = wh.hn(_a) === "h";
//                   _aa = _ta ? wh.rv(_a) : _a;
//                   _d = _aa[_b];
//                   _td = wh.hn(_d) === "h";
//                   o.is_affected |= _ta || _td;
//                   return wh.rv(_d);
//                 }
//               }
//               return undefined;
//           }
//           break;
//         case 8:
//           _a = {};
//           _a[ops[1]] = rev(ops[2], e, s, g, o, _f);
//           return _a;
//           break;
//         case 9:
//           _a = rev(ops[1], e, s, g, o, _f);
//           _b = rev(ops[2], e, s, g, o, _f);
//           function merge(_a: any, _b: any, _ow: any): any {
//             _ta = wh.hn(_a) === "h";
//             _tb = wh.hn(_b) === "h";
//             _aa = wh.rv(_a);
//             _bb = wh.rv(_b);
//             for (const k in _bb) {
//               if (_ow || !_aa.hasOwnProperty(k)) {
//                 _aa[k] = should_pass_type_info
//                   ? _tb
//                     ? wh.nh(_bb[k], "e")
//                     : _bb[k]
//                   : wh.rv(_bb[k]);
//               }
//             }
//             return _a;
//           }
//           const _c = _a;
//           let _ow = true;
//           if (typeof ops[1][0] === "object" && ops[1][0][0] === 10) {
//             _a = _b;
//             _b = _c;
//             _ow = false;
//           }
//           if (typeof ops[1][0] === "object" && ops[1][0][0] === 10) {
//             const _r = {};
//             return merge(merge(_r, _a, _ow), _b, _ow);
//           } else return merge(_a, _b, _ow);
//           break;
//         case 10:
//           _a = rev(ops[1], e, s, g, o, _f);
//           _a = should_pass_type_info ? _a : wh.rv(_a);
//           return _a;
//           break;
//         case 12:
//           let _r;
//           _a = rev(ops[1], e, s, g, o);
//           if (!o.ap) {
//             return should_pass_type_info && wh.hn(_a) === "h"
//               ? wh.nh(_r, "f")
//               : _r;
//           }
//           ap = o.ap;
//           _b = rev(ops[2], e, s, g, o, _f);
//           o.ap = ap;
//           _ta = wh.hn(_a) === "h";
//           _tb = _ca(_b);
//           _aa = wh.rv(_a);
//           _bb = wh.rv(_b);
//           const snap_bb = $gdc(_bb, "nv_");
//           try {
//             _r =
//               typeof _aa === "function"
//                 ? // eslint-disable-next-line prefer-spread
//                   $gdc(_aa.apply(null, snap_bb))
//                 : undefined;
//           } catch (e) {
//             _r = undefined;
//           }
//           return should_pass_type_info && (_tb || _ta) ? wh.nh(_r, "f") : _r;
//       }
//     } else {
//       if (op === 3 || op === 1) return ops[1];
//       else if (op === 11) {
//         let _a = "";
//         for (let i = 1; i < ops.length; i++) {
//           const xp = wh.rv(rev(ops[i], e, s, g, o, _f));
//           _a += typeof xp === "undefined" ? "" : xp;
//         }
//         return _a;
//       }
//     }
//   }
//   function wrapper(ops: any, e: any, s: any, g: any, o: any, newap: any) {
//     return rev(ops, e, s, g, o, newap);
//   }
//   return wrapper;
// }
