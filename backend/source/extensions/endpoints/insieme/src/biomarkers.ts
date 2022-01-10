//
// biomarkers.ts
//

import { getApiJson } from './utilities';

// https://fusejs.io/api/methods.html
import Fuse from 'fuse.js';

// static list of biomarkers used for search is derived from this query:
// http://api.insieme.app/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,translations.summary&limit=1000&filter={"status":{"_contains": "published"}}
import biomarkers from './assets/biomarkers.json';

const biomarkersOptions = {
	minMatchCharLength: 4,
	includeScore: true,
	keys: [
		{ name: 'id', weight: 1.0 },
		{ name: 'translations.name', weight: 1.0 },
        { name: 'extras.aliases', weight:1.0 },
		{ name: 'translations.description', weight: 0.5 },
		{ name: 'translations.summary', weight: 0.25 },
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
//        const biomarkersUrl = "/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,extras,units.id,units.description,units.extras,translations.summary&limit=1000&filter={'status':{'_contains': 'published'}}"
  //      const biomarkersUrl = "/items/biomarkers?fields=id,description,translations.languageCode,translations.name,translations.description,extras,units.id,units.description,units.extras,translations.summary&limit=1000&filter=%7B%27status%27%3A%7B%27_contains%27%3A%20%27published%27%7D%7D"


//        const biomarkers = await getApiJson(biomarkersUrl)


		biomarkersFuse = new Fuse(biomarkers.data, biomarkersOptions);
	}
	return biomarkersFuse.search(query);
}
