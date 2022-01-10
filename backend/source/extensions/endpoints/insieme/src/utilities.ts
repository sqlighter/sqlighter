// https://www.npmjs.com/package/axios
import axios from 'axios';
import { assert } from 'console';

export async function getApiJson(relativeUrl: string) {
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
