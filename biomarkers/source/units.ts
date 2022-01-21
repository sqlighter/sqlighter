//
// units.ts - measurement units utilities
//

import Fuse from 'fuse.js';
import { resolve } from 'path';

import { Api, writeJson, readJson } from './utilities';
import { Metadata } from './metadata';

// default confidence level used for searchUnits
export const UNITS_SEARCH_CONFIDENCE = 0.7;

/** A measurement unit */
export class Unit {
	constructor(id: string, description?: string, metadata?: Metadata) {
		this.id = id;
		this.description = description || '';
		this.metadata = metadata || new Metadata();
	}

	/** Unit id, eg. μg/L */
	readonly id: string;

	/** Short description, eg. microgram per liter */
	readonly description: string;

	/** External references and related contents */
	readonly metadata: Metadata;

	/** Unit is also know as, eg. ug/L */
	public get aliases(): string[] {
		return this.metadata?.aliases as string[];
	}

	/** A list of other units and a conversion value, eg. μg/L to mg/L is 0.001 */
	public get conversions(): { [unit: string]: number } {
		return this.metadata?.conversions as { [unit: string]: number };
	}

	//
	// public methods
	//

	public toString(): string {
		return `${this.id}: ${this.description}`;
	}

	/**
	 * Will render to id if nested in a json
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
	 */
	public toJSON(key: any) {
		return key ? this.id : this;
	}

	//
	// static methods
	//

	/** Returns list of all available measurement units */
	public static getUnits(): Unit[] {
		return Object.values(_units);
	}

	/** Returns measurement unit by id (or undefined) */
	public static getUnit(unitId: string): Unit | undefined {
		return _units[unitId];
	}

	/** Search given unit by text and returns zero or more matches with given or higher confidence (a 0 to 1 value) */
	public static searchUnits(text: string, confidence: number = UNITS_SEARCH_CONFIDENCE): { item: Unit; confidence: number }[] {
		if (confidence < 0 || confidence > 1) {
			throw new Error(`searchUnits('${text}', ${confidence}) - confidence should be between 0 and 1`);
		}

		const matches = _unitFuse.search(text);
		if (matches) {
			let filtered = matches.map((m) => {
				return { item: _units[m.item.id] as Unit, confidence: 1 - (m.score as number) };
			});
			filtered = filtered.filter((m) => m.confidence >= confidence);
			return filtered;
		}

		return [];
	}

	/** Updates to latest version of units.json (requires a restart) */
	public static async updateUnits() {
		const unitsPath = resolve('./source/assets/units.json');
		try {
			const units = (await Api.getJson('/items/units?fields=*&limit=1000')).data;
			await writeJson(unitsPath, units);
		} catch (exception) {
			console.error(`Units.getUnits - could not read units from network, using: ${unitsPath}`);
			throw exception;
		}
	}
}

// initialize units data from units.json
const _units: { [unit: string]: Unit } = {};
const _unitsJson = require('./assets/units.json');
_unitsJson.forEach((u: any) => (_units[u.id] = new Unit(u.id, u.description, u.metadata)));

// index used for searching
const _unitFuse: Fuse<any> = new Fuse<any>(
	Unit.getUnits().map((unit: any) => {
		return { id: unit.id, aliases: unit.metadata?.aliases, conversions: unit.metadata?.conversions && Object.keys(unit.metadata?.conversions) };
	}),
	{
		minMatchCharLength: 1,
		includeScore: true,
		keys: [
			{ name: 'id', weight: 1.0 },
			{ name: 'metadata.aliases', weight: 0.9 },
			{ name: 'conversions', weight: 0.8 },
		],
	}
);

// class also acts as default export for module
export default Unit;
