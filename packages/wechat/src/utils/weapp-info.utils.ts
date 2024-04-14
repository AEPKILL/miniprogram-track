/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-14 10:39:01
 */

import { MiniprogramInfo } from "@miniprogram-track/shared";

export async function getPartialMiniprogramInfoByAppid(
  appid: string
): Promise<Omit<MiniprogramInfo, "wxapkgPaths" | "path">> {
  type ServerResponse = {
    nickname: string;
    username: string;
    description: string;
    avatar: string;
    principal_name: string;
    appid: string;
  };

  const response = (await fetch("https://kainy.cn/api/weapp/info/", {
    body: JSON.stringify({
      appid
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((r) => r.json())
    .then((r) => r.data || {})
    .catch((e) => {
      console.log("error:", e);
      return {};
    })) as ServerResponse;

  return {
    appid,
    name: response.nickname,
    description: response.description,
    avatar: response.avatar,
    author: response.principal_name,
    authorId: response.username
  };
}
