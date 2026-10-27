#!/usr/bin/env node

import { codingApp } from "./app.ts";
import { runDurableApp } from "./run.ts";

await runDurableApp(codingApp, process.argv.slice(2));
