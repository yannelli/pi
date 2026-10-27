import { type DurableApp, type OpenDurableOptions, openDurable } from "./runtime.ts";
import { runDurableTui } from "./tui.ts";

function parseArgs(argv: readonly string[]): OpenDurableOptions {
	let continueSession = false;
	for (const arg of argv) {
		if (arg === "--continue" || arg === "-c") continueSession = true;
		else throw new Error(`Unknown argument: ${arg}`);
	}
	return { continueSession };
}

/** Open a session of `app` from command line arguments and run the TUI until it exits. */
export async function runDurableApp(app: DurableApp, argv: readonly string[]): Promise<void> {
	const durable = await openDurable(app, parseArgs(argv));
	try {
		await runDurableTui(durable.view, durable.controller, durable.settings);
	} finally {
		await durable.close();
	}
}
