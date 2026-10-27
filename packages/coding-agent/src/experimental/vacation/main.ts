#!/usr/bin/env node

import { runDurableApp } from "../durable/run.ts";
import { vacationApp } from "./app.ts";

await runDurableApp(vacationApp, process.argv.slice(2));
