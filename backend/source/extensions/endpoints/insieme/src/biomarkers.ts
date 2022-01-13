//
// biomarkers.ts
//

import { getApiJson } from './utilities';

// https://fusejs.io/api/methods.html
import Fuse from 'fuse.js';

// https://www.npmjs.com/package/tokenizr
import Tokenizr from 'tokenizr';

// static list of biomarkers used for search is derived from this query:
// http://api.insieme.app/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,translations.summary&limit=1000&filter={"status":{"_contains": "published"}}
//import biomarkers from './assets/biomarkers.json';

let biomarkersData: any = null;
let biomarkersFuse: Fuse<any> | null = null;

function filterMatches<T>(matches: Fuse.FuseResult<T>[], confidence: number) {
	if (matches) {
		let filtered = matches.map((m: any) => {
			return { item: m.item, confidence: 1 - (m.score as number) };
		});
		filtered = filtered.filter((m: any) => m.confidence > confidence);
		return filtered;
	}

	return [];
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
export async function searchBiomarkers(query: string, confidence: number = 0.7): Promise<{ item: any; confidence: number }[]> {
	if (!biomarkersFuse) {
		const biomarkersUrl =
			'/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,extras,units.id,units.description,units.extras,translations.summary&limit=1000'; //&filter={'status':{'_contains': 'published'}}"
		//        const biomarkersUrl = "/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,extras,units.id,units.description,units.extras,translations.summary&limit=1000&filter=%7B%27status%27%3A%7B%27_contains%27%3A%20%27published%27%7D%7D"

		const biomarkers = await getApiJson(biomarkersUrl);
		biomarkersData = biomarkers.data;

		biomarkersFuse = new Fuse<any>(biomarkersData, {
			minMatchCharLength: 4,
			includeScore: true,
			keys: [
				{ name: 'id', weight: 1.0 },
				{ name: 'translations.name', weight: 1.0 },
				{ name: 'extras.aliases', weight: 1.0 },
				{ name: 'translations.description', weight: 0.5 },
				{ name: 'translations.summary', weight: 0.25 },
				// TODO could have aliases for names, etc.
			],
		});
	}

	const matches: any = biomarkersFuse.search(query);
	return filterMatches(matches, confidence);
}

let unitsFuse: Fuse<any> | null = null;

export async function searchUnits(text: string, confidence: number = 0.7): Promise<any> {
	if (!unitsFuse) {
		const unitsUrl = '/items/units?fields=id,name,extras&limit=1000';

		let units = await getApiJson(unitsUrl);
		units = units.data.map((unit: any) => {
			return { id: unit.id, conversions: unit?.extras?.conversions && Object.keys(unit?.extras?.conversions) };
		});

		unitsFuse = new Fuse<any>(units, {
			minMatchCharLength: 1,
			includeScore: true,
			keys: [
				{ name: 'id', weight: 1.0 },
				{ name: 'conversions', weight: 0.8 },
			],
		});
	}

	const matches = unitsFuse.search(text);
	return filterMatches(matches, confidence);
}

//
// Parsing of biomarker values and ranges
//

const lexer = new Tokenizr();
lexer.rule(/(\d+([\.,]\d+)?)/, (ctx, match) => {
	// accept floating point with both . and , decimals
	ctx.accept('number', match[0] && parseFloat(match[0].replace(',', '.')));
});
lexer.rule(/assente|assenti/, (ctx, match) => {
	ctx.accept('number', 0);
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
lexer.rule(/positive|positivo/, (ctx, match) => {
	ctx.accept('positive');
});
lexer.rule(/negative|negativo/, (ctx, match) => {
	ctx.accept('negative');
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

/**
 * Parse a biomarkers range string like 10-20 into its components
 * @param text A range string like [10,20-20,80] or 345-500 etc
 * @returns Structured range or null
 */
export function parseRange(text: string): { text: string; min?: number; max?: number } | null {
	const { sequence, tokens } = parseTokens(text.toLowerCase());
	if (sequence && tokens) {
		// eg. [10-20]
		if (sequence == 'startrange-number-dash-number-endrange-eof') {
			return { text: `${tokens[1]?.value} - ${tokens[3]?.value}`, min: tokens[1]?.value, max: tokens[3]?.value };
		}
		// eg. 10-20
		if (sequence == 'number-dash-number-eof') {
			return { text: `${tokens[0]?.value} - ${tokens[2]?.value}`, min: tokens[0]?.value, max: tokens[2]?.value };
		}
		// eg. [assenti]
		if (sequence == 'startrange-number-endrange-eof') {
			return { text: `${tokens[1]?.value}`, min: tokens[1]?.value, max: tokens[1]?.value };
		}
		// eg. <20 or <=20
		if (sequence == 'lessthan-number-eof') {
			return { text: `${tokens[0]?.value} ${tokens[1]?.value}`, max: tokens[1]?.value };
		}
		// eg. [<20]
		if (sequence == 'startrange-lessthan-number-endrange-eof') {
			return { text: `${tokens[1]?.value} ${tokens[2]?.value}`, max: tokens[2]?.value };
		}
		// eg. >20 or ≥20
		if (sequence == 'morethan-number-eof') {
			return { text: `${tokens[0]?.value} ${tokens[1]?.value}`, min: tokens[1]?.value };
		}
		// eg. [>50]
		if (sequence == 'startrange-morethan-number-endrange-eof') {
			return { text: `${tokens[1]?.value} ${tokens[2]?.value}`, min: tokens[2]?.value };
		}
	}
	return null;
}

/**
 * Parse a biomarker value like 10.40 or 234,34 or positive or negative or assente
 * @param text A value string
 * @returns Parsed value or null
 */
export function parseValue(text: string): { value: number; text: string } | null {
	const { sequence, tokens } = parseTokens(text.toLowerCase());
	if (sequence && tokens) {
		if (sequence == 'number-eof') {
			return { text: tokens[0]?.text || '', value: tokens[0]?.value };
		}
		if (sequence == 'positive-eof') {
			return { text: 'positive', value: 1 };
		}
		if (sequence == 'negative-eof') {
			return { text: 'negative', value: 0 };
		}
	}
	return null;
}

const UNITS_CONFIDENCE_THRESHOLD = 0.7;

/**
 * Will parse a piece of text looking for a measurement unit that is compatible with the given biomarker
 * @param text The text that could contain the biomarker's units
 * @param biomarker A biomarker as returned by searchBiomarkers
 * @returns A unit and its optional conversion ratio to the biomarker's base unit
 */
export function parseUnits(text: string, biomarker: any): { units: string; conversion: number; confidence: number } | null {
	if (!biomarker.units) {
		console.warn(`parseUnits - biomarker: ${biomarker.id} does not have a unit of measurement set`)
		return null;
	}

	// each biomarker has a main unit of measurement which is preferred (normally the SI unit)
	// and a number of available conversions that can also be read
	const unitsCandidates = new Array<string>(biomarker.units.id);
	if (biomarker.units?.extras?.conversions) {
		unitsCandidates.push(...Object.keys(biomarker.units.extras.conversions));
	}

	const unitsFuse = new Fuse(unitsCandidates, { minMatchCharLength: 1, includeScore: true });
	const unitsMatches = unitsFuse.search(text);

	if (unitsMatches.length > 0 && unitsMatches[0]) {
		const confidence = 1 - (unitsMatches[0].score as number);
		if (confidence > UNITS_CONFIDENCE_THRESHOLD) {
			return {
				units: unitsMatches[0].item,
				conversion: unitsMatches[0].refIndex > 0 ? biomarker.units.extras.conversions[unitsMatches[0].item] : 1,
				confidence,
			};
		}
	}

	return null;
}
