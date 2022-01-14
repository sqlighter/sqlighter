//
// units.ts - measurement units utilities
//

// https://fusejs.io/api/methods.html
import Fuse from 'fuse.js';

// default confidence level used for searchUnits
export const UNITS_SEARCH_CONFIDENCE = 0.7;

/** A measurement unit */
export class Unit {
	constructor(id: string, description?: string, aliases?: string[], conversions?: { [unit: string]: number }, references?: string[]) {
		this.id = id;
		this.description = description || '';
		this.aliases = aliases || [];
		this.conversions = conversions || {};
		this.references = references || [];
	}

	/** Unit id, eg. μg/L */
	readonly id: string;

	/** Short description, eg. microgram per liter */
	readonly description: string;

	/** Unit is also know as, eg. ug/L */
	readonly aliases: string[];

	/** A list of other units and a conversion value, eg. μg/L to mg/L is 0.001 */
	readonly conversions: { [unit: string]: number };

	/** External references and related contents */
	readonly references: string[];

    //
    // public methods
    //

	public toString(): string {
		return `${this.id}: ${this.description}`;
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

		// lazy-load fuse index
		if (!_unitFuse) {
			const unitsData = Unit.getUnits().map((unit: any) => {
				return { id: unit.id, aliases: unit.aliases, conversions: unit.extras?.conversions && Object.keys(unit?.conversions) };
			});

			_unitFuse = new Fuse<any>(unitsData, {
				minMatchCharLength: 1,
				includeScore: true,
				keys: [
					{ name: 'id', weight: 1.0 },
					{ name: 'aliases', weight: 0.9 },
					{ name: 'conversions', weight: 0.8 },
				],
			});
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
}

// retrieve static data from units.json, remap
const _unitsJson = require('./units.json');
const _units: { [unit: string]: Unit } = {};
_unitsJson.forEach((u: any) => (_units[u.id] = new Unit(u.id, u.description, u.aliases, u.conversions, u.references)));

// index used for units searches
let _unitFuse: Fuse<any> | undefined = undefined;

// class also acts as default export for module
export default Unit;
