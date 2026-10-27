import type { ProviderHeaders } from "../types.ts";

export function headersToRecord(headers: Headers): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, value] of headers.entries()) {
		result[key] = value;
	}
	return result;
}

/** Whether `headers` has `name` (case-insensitive) with a non-blank value. */
export function hasHeader(headers: ProviderHeaders | undefined, name: string): boolean {
	if (!headers) return false;
	const expected = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === expected && value !== null && value.trim().length > 0) return true;
	}
	return false;
}

/**
 * The API key for SDK clients that require one. When auth is carried in an `authorization` or
 * `cf-aig-authorization` header instead, returns a placeholder the SDK accepts.
 */
export function getClientApiKey(
	provider: string,
	apiKey: string | undefined,
	headers: ProviderHeaders | undefined,
): string {
	if (apiKey) return apiKey;
	if (hasHeader(headers, "authorization") || hasHeader(headers, "cf-aig-authorization")) return "unused";
	throw new Error(`No API key for provider: ${provider}`);
}

export function providerHeadersToRecord(
	...headerSources: (ProviderHeaders | undefined)[]
): Record<string, string> | undefined {
	const merged = new Map<string, [string, string]>();
	for (const source of headerSources) {
		for (const [name, value] of Object.entries(source ?? {})) {
			const normalizedName = name.toLowerCase();
			merged.delete(normalizedName);
			if (value !== null) merged.set(normalizedName, [name, value]);
		}
	}
	return merged.size > 0 ? Object.fromEntries(merged.values()) : undefined;
}
