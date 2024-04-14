/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 14:29:23
 */

export type MiniprogramInfo = {
  /** 小程序名称*/
  name: string;

  /** 小程序描述 */
  description: string;

  /** 小程序开发者 */
  author: string;

  /** 小程序开发者 id */
  authorId: string;

  /** 小程序路径 */
  miniprogramDir: string;

  /** 小程序头像 */
  avatar: string;

  /** 小程序 appid */
  appid: string;

  /** 小程序包路径 */
  wxapkgPaths: string[];
};
