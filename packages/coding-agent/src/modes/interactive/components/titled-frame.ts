import { type Component, Container, Spacer, Text } from "@earendil-works/pi-tui";
import type { Theme } from "../theme/theme.ts";
import { DynamicBorder } from "./dynamic-border.ts";

/** `body` between accent borders, under a bold accent title and above an optional dim footer. */
export function titledFrame(theme: Theme, title: string, body: Component[], footer?: string): Container {
	const container = new Container();
	container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));
	container.addChild(new Text(theme.fg("accent", theme.bold(title)), 1, 0));
	for (const child of body) container.addChild(child);
	if (footer) {
		container.addChild(new Spacer(1));
		container.addChild(new Text(theme.fg("dim", footer), 1, 0));
	}
	container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));
	return container;
}
