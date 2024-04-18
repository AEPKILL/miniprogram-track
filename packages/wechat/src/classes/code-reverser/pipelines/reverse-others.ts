/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-17 22:00:38
 */

import { BundleFileNameEnum } from "@/enum/bundle-file-name.enum";
import { ReversePipeline } from "../_type";
import { FileBundle } from "@/classes/file-bundle";

export const reverseOthers: ReversePipeline = ({
  originalBundle,
  restoreBundle
}) => {
  const specialBundleFiles = Object.values(BundleFileNameEnum).map((it) =>
    FileBundle.addRootPrefix(it)
  );

  for (const it of originalBundle.filesList) {
    if (!specialBundleFiles.includes(it.path)) {
      restoreBundle.append(it);
    }
  }
};
