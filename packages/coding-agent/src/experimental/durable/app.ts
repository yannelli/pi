import { createCodingRegistry } from "./harness-setup.ts";
import type { DurableApp } from "./runtime.ts";
import { Subagent } from "./subagent.ts";

/** The durable coding agent: pi's coding tools and prompt and the subagent tool, run in the working directory. */
export const codingApp: DurableApp = {
	name: "durable",
	createRegistry: (settingsManager, cwd) => {
		const registry = createCodingRegistry(settingsManager, cwd);
		registry.install(Subagent);
		return registry;
	},
	rootAgent: (cwd) => ({ cwd }),
	executionEnvs: true,
};
