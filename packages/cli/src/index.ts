#!/usr/bin/env node

/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 17:22:03
 */

import "reflect-metadata";

import { CLI, Shim } from "clime";
import { resolve } from "path";

const cli = new CLI("miniprogram-track", resolve(__dirname, "commands"));
const shim = new Shim(cli);

shim.execute(process.argv);
