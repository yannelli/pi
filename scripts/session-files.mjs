// Helpers shared by the session statistics scripts (edit-tool-stats, read-tool-stats, session-context-stats).

import { promises as fs } from "node:fs";
import path from "node:path";

/** Creation time encoded in a session file name such as `2025-01-02T03-04-05-678Z_<id>.jsonl`, or null. */
export function parseSessionFileTimestamp(sessionFile) {
	const rawTimestamp = path.basename(sessionFile).split("_")[0];
	if (!rawTimestamp) return null;
	const ms = Date.parse(rawTimestamp.replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, "T$1:$2:$3.$4Z"));
	return Number.isFinite(ms) ? ms : null;
}

/** Every `.jsonl` file under `dir`, recursively, in name order. */
export async function* walkJsonlFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	entries.sort((a, b) => a.name.localeCompare(b.name));
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walkJsonlFiles(fullPath);
		else if (entry.isFile() && entry.name.endsWith(".jsonl")) yield fullPath;
	}
}

/**
 * The earliest session time to scan: `--since`, else the birth time of `--auto-since-path`, else null.
 * `--all-sessions` disables the filter.
 */
export async function resolveAutoSinceMs(options) {
	if (options.allSessions) return null;
	if (options.since) {
		const ms = Date.parse(options.since);
		if (!Number.isFinite(ms)) throw new Error(`Invalid --since value: ${options.since}`);
		return { ms, source: `--since ${options.since}` };
	}
	if (!options.autoSincePath) return null;
	try {
		const stats = await fs.stat(options.autoSincePath);
		const ms = Number.isFinite(stats.birthtimeMs) && stats.birthtimeMs > 0 ? stats.birthtimeMs : stats.mtimeMs;
		return Number.isFinite(ms) && ms > 0 ? { ms, source: `birth time of ${options.autoSincePath}` } : null;
	} catch {
		return null;
	}
}

/** The text blocks of message content joined by newlines. */
export function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content
		.filter((block) => block?.type === "text" && typeof block.text === "string")
		.map((block) => block.text)
		.join("\n");
}
