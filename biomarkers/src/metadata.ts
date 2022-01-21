//
// metadata.ts
//

/** Metadata entries are numeric or string values arranged in dictionaries and arrays */
export type Entry = { [key: string]: string | number | any | Entry | Entry[] };

/** Additional metadata for an object */
export class Metadata {
	constructor(args?: any) {
		if (args) {
			Object.assign(this, args);
		}
	}

	/** Metadata values can be accessed by property name */
	[key: string]: Entry;
}
