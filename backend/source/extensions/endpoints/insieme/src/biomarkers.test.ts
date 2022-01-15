//
// biomarkers.ts test
//

import assert from 'assert/strict';
import { Biomarker, parseRange, parseValue } from './biomarkers';
import { Translation } from './translations';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

describe('biomarkers.ts', () => {
	test('searchBiomarkers (exact)', async () => {
		let b1s = await Biomarker.searchBiomarkers('glucose');
		expect(b1s[0]?.item.id).toBe('glucose');
		expect(b1s[0]?.item.translations?.[0]?.name).toBe('Glucose');
		expect(b1s[0]?.confidence).toBeCloseTo(1);

		b1s = await Biomarker.searchBiomarkers('Glucosio');
		expect(b1s[0]?.item.id).toBe('glucose');
		expect(b1s[0]?.item.translations?.[1]?.name).toBe('Glucosio');
		expect(b1s[0]?.confidence).toBeCloseTo(1);

		b1s = await Biomarker.searchBiomarkers('Urine Glucose');
		expect(b1s[0]?.item.id).toBe('urine-glu');
		expect(b1s[0]?.item.translations?.[0]?.name).toBe('Urine Glucose');
		expect(b1s[0]?.confidence).toBeCloseTo(1);
	});

	test('searchBiomarkers (partial)', async () => {
		let b1s = await Biomarker.searchBiomarkers('Leucociti');
		expect(b1s[0]?.item.id).toBe('wbc');
		expect(b1s[0]?.item.translations?.[1]?.name).toBe('Leucociti (globuli bianchi)');
		expect(b1s[0]?.confidence).toBeGreaterThan(0.5);
	});

	test('searchBiomarkers (mispelled)', async () => {
		let b1s = await Biomarker.searchBiomarkers('glucoze'); // glucose
		expect(b1s[0]?.item.id).toBe('glucose');

		b1s = await Biomarker.searchBiomarkers('Glucoso'); // glucosio
		expect(b1s[0]?.item.id).toBe('glucose');

		b1s = await Biomarker.searchBiomarkers('ematocreep'); // hematocrit
		expect(b1s[0]?.item.id).toBe('hct');

		b1s = await Biomarker.searchBiomarkers('Ematocripo'); // ematocrito
		expect(b1s[0]?.item.id).toBe('hct');

		//	b1s = await searchBiomarkers('Leucocizi'); // leuco
		//	expect(b1s[0].item.id).toBe('wbc');

		//	b1s = await searchBiomarkers('Globuli Bianchi'); // globuli bianchi
		//	expect(b1s[0].item.id).toBe('wbc');

		//	b1s = await searchBiomarkers('Gloculi Biandi'); // globuli bianchi
		//	expect(b1s[0].item.id).toBe('wbc');
	});

	test('parseRange', async () => {
		let res = parseRange('[10-20]');
		expect(res && res.text).toBe('10 - 20');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = parseRange('10- 20');
		expect(res && res.text).toBe('10 - 20');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = parseRange('[ assenti]');
		expect(res && res.text).toBe('0');
		expect(res && res.min).toBe(0);
		expect(res && res.max).toBe(0);

		res = parseRange('10.632 - 20,34');
		expect(res && res.text).toBe('10.632 - 20.34');
		expect(res && res.min).toBe(10.632);
		expect(res && res.max).toBe(20.34);

		res = parseRange('10-20');
		expect(res && res.text).toBe('10 - 20');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = parseRange('[10.632 - 20,34');
		expect(res).toBeNull();

		res = parseRange(' < 10.50 ');
		expect(res && res.text).toBe('< 10.5');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		res = parseRange('[ < 10.50] ');
		expect(res && res.text).toBe('< 10.5');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		res = parseRange('[ >=20,50] ');
		expect(res && res.text).toBe('>= 20.5');
		expect(res && res.min).toBe(20.5);
		expect(res && res.max).toBeUndefined();

		res = parseRange('Mickey');
		expect(res).toBeNull();
	});

	test('parseValue', async () => {
		let res = parseValue('10');
		expect(res && res.value).toBe(10);

		res = parseValue('10,3200  '); // with comma
		expect(res && res.value).toBe(10.32);
		expect(res && res.text).toBe('10,3200');

		res = parseValue(' 010.32100  ');
		expect(res && res.value).toBe(10.321);
		expect(res && res.text).toBe('010.32100');

		res = parseValue(' assenti  ');
		expect(res && res.value).toBe(0);
		expect(res && res.text).toBe('assenti');

		res = parseValue(' positivo  ');
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = parseValue(' Positivo  '); // uppercase
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = parseValue(' Positive');
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = parseValue(' NEGATIVE'); // allcaps
		expect(res && res.value).toBe(0);
		expect(res && res.text).toBe('negative');

		res = parseValue('this is not a value');
		expect(res).toBeNull();
	});
});
