export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Whether a filesystem error reports that the path does not exist. */
export function isMissingPath(error: unknown): boolean {
	return isRecord(error) && error.code === "ENOENT";
}
