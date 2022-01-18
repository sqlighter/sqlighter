//
// utilities.ts
//

// https://www.npmjs.com/package/axios
import axios from 'axios';
import { assert } from 'console';
import fs from 'fs/promises';

export class Api {
	public static async getJson(relativeUrl: string): Promise<any> {
		assert(relativeUrl.startsWith('/'));
		const url = 'https://api.insieme.app' + relativeUrl;
		const token = 'topolino';
		try {
			const results = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			return results.data;
		} catch (exception) {
			console.error(`getApiJson - ${url}`, exception);
			throw exception;
		}
	}
}

export async function getApiJson(relativeUrl: string) {
	assert(relativeUrl.startsWith('/'));
	const url = 'https://api.insieme.app' + relativeUrl;
	//	const url = 'http://localhost:8055' + relativeUrl;
	const token = 'topolino';
	try {
		const results = await axios.get(url, {
			headers: { Authorization: `Bearer ${token}` },
		});

		return results.data;
	} catch (exception) {
		console.error(`getApiJson - ${url}`, exception);
		throw exception;
	}
}

/** Write given data to a json file */
export async function writeJson(jsonPath: string, jsonData: any) {
	try {
		const stringified = JSON.stringify(jsonData, null, '\t');
		await fs.writeFile(jsonPath, stringified);
	} catch (exception) {
		console.error(`writeJson - ${jsonPath}, exception: ${exception}`, exception);
		throw exception;
	}
}

/** Read json from a local file */
export async function readJson(jsonPath: string) {
	try {
		const stringified = (await fs.readFile(jsonPath)).toString();
		return JSON.parse(stringified);
	} catch (exception) {
		console.error(`readJson - ${jsonPath}, exception: ${exception}`, exception);
		throw exception;
	}
}

/** Rounds number to two decimal digits at most */
export function round(value: number) {
	return Math.round(value * 100.0) / 100.0;
}
