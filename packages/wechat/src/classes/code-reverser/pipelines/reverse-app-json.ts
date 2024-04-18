/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 22:00:38
 */

import { ReversePipeline } from "../_type";

export const reverseAppJson: ReversePipeline = ({
  appConfig,
  restoreBundle
}) => {
  if (!appConfig) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { subPackages, pages, page, entryPagePath, ...rest } = appConfig;

  const finallyPages = pages.filter((it: string) =>
    subPackages.every((it2: any) => !it.startsWith(it2.root.substring(1)))
  );

  restoreBundle.append({
    path: "app.json",
    buffer: Buffer.from(
      JSON.stringify(
        {
          pages: finallyPages,
          subPackages,
          entryPagePath: (entryPagePath || "").replace(/\.html$/, ""),
          ...rest
        },
        null,
        2
      )
    )
  });
};
