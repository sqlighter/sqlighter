//
// biomarkers.ts
//

import Fuse from 'fuse.js';

// static list of biomarkers used for search is derived from this query:
// http://api.insieme.app/items/biomarkers?fields=*.*
import biomarkers from './assets/biomarkers.json';

const biomarkersOptions = {
	minMatchCharLength: 4,
	includeScore: true,
	keys: [
		{ name: 'id', weight: 1.0 },
		{ name: 'translations.name', weight: 1.0 },
		{ name: 'translations.description', weight: 0.2 },
        // TODO could have aliases for names, etc.
	],
};

let biomarkersFuse: any = null;

/**
 * Will fuzzy search a biomarker by id, name or words in its description
 * and return a ranked list of possible biomarkers hits including a score
 * where zero is a perfect match.
 * @see https://fusejs.io/examples.html#extended-search
 * @param query A name to search (may contain wildcards for extended search)
 * @returns A ranked list of possible matches
 */
export async function searchBiomarkers(query: string): Promise<any> {
	if (!biomarkersFuse) {
		biomarkersFuse = new Fuse(biomarkers, biomarkersOptions);
	}
	return biomarkersFuse.search(query);
}
