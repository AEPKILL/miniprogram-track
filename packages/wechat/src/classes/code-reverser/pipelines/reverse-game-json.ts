/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-15 22:00:38
 */

import { ReversePipeline } from "../_type";

export const reverseGameJson: ReversePipeline = ({
  gameConfig,
  restoreBundle
}) => {
  if (!gameConfig) return;

  restoreBundle.append({
    path: "app.json",
    buffer: Buffer.from(JSON.stringify(gameConfig, null, 2))
  });
};
