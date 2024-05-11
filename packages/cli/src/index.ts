#!/usr/bin/env node

/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 17:22:03
 */

import "reflect-metadata";

import { CLI, Shim } from "clime";
import { resolve } from "path";
import os from "os";
import chalk from "chalk";

if (os.platform() != "win32") {
  console.log(chalk.red("目前 miniprogram-track 仅支持 windows 系统"));
  process.exit(0);
}

const cli = new CLI("miniprogram-track", resolve(__dirname, "commands"));
const shim = new Shim(cli);

shim.execute(process.argv);
