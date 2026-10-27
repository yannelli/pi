import { createRegistry } from "@earendil-works/pi-durable";
import type { DurableApp } from "../durable/runtime.ts";
import { Search, Vacation } from "./vacation.ts";

/** The vacation planner and its research subagent's search; no coding tools, pi prompt, or execution environments. */
export const vacationApp: DurableApp = {
	name: "vacation",
	createRegistry: () => {
		const registry = createRegistry();
		registry.install(Vacation);
		registry.install(Search);
		return registry;
	},
	// Only the vacation planner; the research subagent selects search itself.
	rootAgent: () => ({ extensions: [Vacation] }),
	executionEnvs: false,
};
