//
// biomarkers.ts
//

import { resolve } from 'path';
import Fuse from 'fuse.js';
import Tokenizr from 'tokenizr';
import assert from 'assert/strict';

import { Api, writeJson, round } from './utilities';
import { Unit } from './units';
import { Translation } from './translations';
import { Metadata } from './metadata';

export const BIOMARKERS_SEARCH_CONFIDENCE = 0.7;
export const UNITS_SEARCH_CONFIDENCE = 0.7;

/** A biomarker, eg. glucose, hdl, ldl, weight, etc */
export class Biomarker {
	constructor(id: string, unit?: string, range?: string, translations?: Translation[], metadata?: any) {
		this.id = id;
		this.translations = translations || [];
		this.metadata = new Metadata(metadata);
		this.range = range;
		if (unit) {
			this.unit = Unit.getUnit(unit);
		}
	}

	/** Biomarker id, eg. glucose */
	id: string;

	/** Translations for biomaker's name, description and summary */
	translations: Translation[];

	/** Measurement unit for this biomarker */
	unit?: Unit;

	/** Range for this biomarker, eg. 120-150 */
	range?: string;

	/** Additional information like: aliases, notes, references */
	metadata: Metadata;

	//
	// static methods
	//

	/** Returns list of all available biomarkers */
	public static getBiomarkers(): Biomarker[] {
		return Object.values(_biomarkers);
	}

	/** Returns biomarker by id (or undefined) */
	public static getBiomarker(biomarkerId: string): Biomarker | undefined {
		return _biomarkers[biomarkerId];
	}

	/**
	 * Will fuzzy search a biomarker by id, name or words in its description
	 * and return a ranked list of possible biomarkers hits including a score
	 * where zero is a perfect match.
	 * @see https://fusejs.io/examples.html#extended-search
	 * @param query A name to search (may contain wildcards for extended search)
	 * @param confidence Will return only results exceeding this confidence level (0 to 1)
	 * @returns A ranked list of possible matches
	 */
	public static searchBiomarkers(query: string, confidence: number = BIOMARKERS_SEARCH_CONFIDENCE): { item: Biomarker; confidence: number }[] {
		assert(_biomarkersFuse);
		const matches = _biomarkersFuse.search(query);
		if (matches) {
			let filtered = matches.map((m) => {
				return { item: _biomarkers?.[m.item.id] as Biomarker, confidence: 1 - (m.score as number) };
			});
			filtered = filtered.filter((m) => m.confidence >= confidence);
			return filtered;
		}

		return [];
	}

	/** Updates to latest version of biomarkers.json (requires a restart) */
	public static async updateBiomarkers() {
		const jsonPath = resolve('./source/assets/biomarkers.json');
		const jsonUrl =
			'/items/biomarkers?fields=id,status,description,range,unit.id,translations.languages_code,translations.name,translations.description,translations.summary,metadata&limit=1000';
		try {
			const biomarkersJson = (await Api.getJson(jsonUrl)).data;
			await writeJson(jsonPath, biomarkersJson);
			_initializeBiomarkers(biomarkersJson);
		} catch (exception) {
			console.error(`Biomarkers.updateBiomarkers - could not read biomarkers from network, exception: ${exception}`, exception);
			throw exception;
		}
	}

	/**
	 * Parse a biomarker value like 10.40 or 234,34 or positive or negative or assente
	 * @param text A value string
	 * @returns Parsed value or null
	 */
	public static parseValue(text: string): { value: number; text?: string } | null {
		const { sequence, tokens } = parseTokens(text.toLowerCase());
		if (sequence && tokens) {
			switch (sequence) {
				case 'number-eof':
				case 'positive-eof':
				case 'negative-eof':
				case 'missing-eof':
					return tokens[0]?.value;
			}
		}
		return null;
	}

	/**
	 * Will parse a piece of text looking for a measurement unit that is compatible with the given biomarker
	 * @param text The text that could contain the biomarker's units
	 * @param biomarker A biomarker as returned by searchBiomarkers
	 * @returns A unit and its optional conversion ratio to the biomarker's base unit
	 */
	public static parseUnits(text: string, biomarker: Biomarker): { id: string; conversion: number; confidence: number } | null {
		if (!biomarker.unit) {
			console.warn(`parseUnits - biomarker: ${biomarker.id} does not have a measurement unit`);
			return null;
		}

		// each biomarker has a main unit of measurement which is preferred (normally the SI unit)
		// and a number of available conversions that can also be read. normally the conversion
		// factors are stored in unit.metadata.conversion. however, some conversions like mmol/L
		// (a quantity of molecules) to mg/L (a weight) require a conversion ratio that is specific
		// to the biomarker and is therefore stored in biomarker.metadata.conversions.
		const unitsCandidates = [biomarker.unit.id];
		const unitsConversions = [1];

		if (biomarker.metadata?.conversions) {
			unitsCandidates.push(...Object.keys(biomarker.metadata.conversions));
			unitsConversions.push(...Object.values(biomarker.metadata.conversions));
		}
		if (biomarker.unit?.conversions) {
			unitsCandidates.push(...Object.keys(biomarker.unit.conversions));
			unitsConversions.push(...Object.values(biomarker.unit.conversions));
		}

		const unitsFuse = new Fuse(unitsCandidates, { minMatchCharLength: 1, includeScore: true });
		const unitsMatches = unitsFuse.search(text);

		if (unitsMatches.length > 0 && unitsMatches[0]) {
			const confidence = 1 - (unitsMatches[0].score as number);
			if (confidence > UNITS_SEARCH_CONFIDENCE) {
				return {
					id: unitsMatches[0].item,
					conversion: unitsConversions[unitsMatches[0].refIndex] as number,
					confidence,
				};
			}
		}

		return null;
	}

	/** Creates a biomarker from an object */
	public static fromObject(obj: any): Biomarker {
		assert(obj.id);
		const translations = obj.translations && Translation.fromObject(obj.translations);
		return new Biomarker(obj.id, obj.unit?.id, obj.range, translations, obj.metadata);
	}

	/**
	 * Will render to id if nested in a json
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
	 */
	public toJSON(key: any) {
		return key ? this.id : this;
	}
}

/** A suggested range for a biomarker */
export class Range {
	constructor(min?: number, max?: number, text?: string, custom?: { tags: string[]; min?: number; max?: number; text?: string }[]) {
		this.min = min;
		this.max = max;
		this.text = text;
	}

	/** Minimum value for range */
	min?: number;

	/** Maximum value for range */
	max?: number;

	/** Textual value, eg. 'positive' */
	text?: string;

	/** TODO Custom ranges for custom tags, eg. "men", "women", "kids", "30-40", etc */
	custom?: { tags: string[]; min?: number; max?: number; text?: string }[];

	//
	// methods
	//

	/** Apply conversion factor to this range */
	public convert(conversion: number) {
		if (conversion != 1) {
			this.min = this.min !== undefined ? round(this.min / conversion) : undefined;
			this.max = this.max !== undefined ? round(this.max / conversion) : undefined;
			this.text = undefined;
			if (this.custom) {
				this.custom.forEach((r) => {
					r.min = r.min !== undefined ? round(r.min / conversion) : undefined;
					r.max = r.max !== undefined ? round(r.max / conversion) : undefined;
					r.text = undefined;
				});
			}
		}
	}

	public toString() {
		if (this.text) {
			return this.text;
		}

		if (this.min != undefined) {
			if (this.max != undefined) {
				return `[${this.min} - ${this.max}]`;
			}
			return `[> ${this.min}]`;
		}

		assert(this.max != undefined);
		return `[< ${this.max}]`;
	}

	/** Will render to string if nested in a json */
	public toJSON(key: any) {
		return key != undefined ? this.toString() : this;
	}

	//
	// static methods
	//

	/**
	 * Parse a biomarkers range string like 10-20 into its components
	 * @param text A range string like [10,20-20,80] or 345-500 etc
	 * @returns Structured range or null
	 */
	public static parseRange(text: string): Range | null {
		const { sequence, tokens } = parseTokens(text.toLowerCase());
		if (sequence && tokens) {
			tokens.forEach((t) => {
				if (t.type == 'number' && t.value.text == undefined) {
					t.value.text = t.value.value;
				}
			});

			// eg. [10-20]
			if (sequence == 'startrange-number-dash-number-endrange-eof') {
				return new Range(tokens[1]?.value.value, tokens[3]?.value.value, `[${tokens[1]?.value.text} - ${tokens[3]?.value.text}]`);
			}
			// eg. 10-20
			if (sequence == 'number-dash-number-eof') {
				return new Range(tokens[0]?.value.value, tokens[2]?.value.value, `[${tokens[0]?.value.text} - ${tokens[2]?.value.text}]`);
			}
			// eg. [assenti]
			if (sequence == 'startrange-number-endrange-eof') {
				return new Range(tokens[1]?.value.value, tokens[1]?.value.value, `[${tokens[1]?.value.text}]`);
			}
			// eg. <20 or <=20
			if (sequence == 'lessthan-number-eof') {
				return new Range(undefined, tokens[1]?.value.value, `[< ${tokens[1]?.value.text}]`);
			}
			// eg. [<20]
			if (sequence == 'startrange-lessthan-number-endrange-eof') {
				return new Range(undefined, tokens[2]?.value.value, `[< ${tokens[2]?.value.text}]`);
			}
			// eg. >20 or ≥20
			if (sequence == 'morethan-number-eof') {
				return new Range(tokens[1]?.value.value, undefined, `[> ${tokens[1]?.value.text}]`);
			}
			// eg. [>50]
			if (sequence == 'startrange-morethan-number-endrange-eof') {
				return new Range(tokens[2]?.value.value, undefined, `[> ${tokens[2]?.value.text}]`);
			}
		}
		return null;
	}
}

/** A biomarker measurement, eg. current glucose level */
export class Measurement {
	constructor(biomarker: Biomarker, value?: number, text?: string, unit?: Unit, range?: Range, metadata?: any) {
		this.biomarker = biomarker;
		this.value = value;
		this.text = text;
		this.unit = unit;
		this.range = range;
		this.metadata = new Metadata(metadata);
	}

	/** The biomarker that was measured */
	biomarker: Biomarker;

	/** Numeric value of the measurement expressed in units */
	value?: number;

	/** Textual value of the measurement, if applicable. Eg. 'negative' */
	text?: string;

	/** The measurement unit (normally matches biomarker.unit) */
	unit?: Unit;

	/** Optional range suggested by the lab. May differ from range in biomarker card itself. */
	range?: Range;

	/** Additional metadata, for example the OCR information that this measure derives from */
	metadata: Metadata;
}

//
// Utilities
//

// static list of available biomarkers and search index
const _biomarkers: { [key: string]: Biomarker } = {};
const _biomarkersJson = require('./assets/biomarkers.json');

// fuse index used for searches
let _biomarkersFuse: Fuse<Biomarker> | undefined;

function _initializeBiomarkers(biomarkersJson: any) {
	biomarkersJson.forEach((b: any) => {
		const biomarker = Biomarker.fromObject(b);
		_biomarkers[biomarker.id] = biomarker;
	});

	// fuse index used for searches
	_biomarkersFuse = new Fuse<Biomarker>(Object.values(_biomarkers), {
		minMatchCharLength: 4,
		includeScore: true,
		keys: [
			{ name: 'id', weight: 1.0 },
			{ name: 'translations.name', weight: 1.0 },
			{ name: 'metadata.aliases', weight: 0.9 },
			{ name: 'translations.description', weight: 0.5 },
			{ name: 'translations.summary', weight: 0.25 },
		],
	});
}

_initializeBiomarkers(_biomarkersJson);

//
// Parsing of biomarker values and ranges
// https://www.npmjs.com/package/tokenizr
//

const lexer = new Tokenizr();
lexer.rule(/(\d+([\.,]\d+)?)/, (ctx, match) => {
	// accept floating point with both . and , decimals
	ctx.accept('number', { value: match[0] && parseFloat(match[0].replace(',', '.')) });
});
lexer.rule(/assente|assenti/, (ctx, match) => {
	ctx.accept('number', { value: 0, text: 'missing' });
});
lexer.rule(/negative|negativo/, (ctx, match) => {
	ctx.accept('number', { value: 0, text: 'negative' });
});
lexer.rule(/positive|positivo/, (ctx, match) => {
	ctx.accept('number', { value: 1, text: 'positive' });
});
lexer.rule(/<=|≤|</, (ctx, match) => {
	ctx.accept('lessthan');
});
lexer.rule(/>=|≥|>|sup\. a/, (ctx, match) => {
	ctx.accept('morethan');
});
lexer.rule(/\[/, (ctx, match) => {
	ctx.accept('startrange');
});
lexer.rule(/\]/, (ctx, match) => {
	ctx.accept('endrange');
});
lexer.rule(/-/, (ctx, match) => {
	ctx.accept('dash');
});
lexer.rule(/\s+/, (ctx, match) => {
	ctx.ignore();
});

function parseTokens(text: string) {
	try {
		lexer.reset();
		lexer.input(text);
		let tokens = lexer.tokens();
		const sequence = tokens.reduce((a, b) => (b.type != 'EOF' ? a + b.type + '-' : a + 'eof'), '');
		return { sequence, tokens };
	} catch (exception) {
		// console.debug(`parseTokens - text: ${text}, exception: ${exception}`);
	}
	return { sequence: null, tokens: null };
}

// class also acts as default export for module
export default Unit;
