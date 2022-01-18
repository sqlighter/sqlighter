//
// biomarkers.test.ts
//

import assert from 'assert/strict';
import { Biomarker, Range } from './biomarkers';

describe('biomarkers.ts', () => {
	test('searchBiomarkers (exact)', () => {
		let b1s = Biomarker.searchBiomarkers('glucose');
		expect(b1s[0]?.item.id).toBe('glucose');
		expect(b1s[0]?.item.translations?.[0]?.name).toBe('Glucose');
		expect(b1s[0]?.confidence).toBeCloseTo(1);

		b1s = Biomarker.searchBiomarkers('Glucosio');
		expect(b1s[0]?.item.id).toBe('glucose');
		expect(b1s[0]?.item.translations?.[1]?.name).toBe('Glucosio');
		expect(b1s[0]?.confidence).toBeCloseTo(1);

		b1s = Biomarker.searchBiomarkers('Urine Glucose');
		expect(b1s[0]?.item.id).toBe('urine-glu');
		expect(b1s[0]?.item.translations?.[0]?.name).toBe('Urine Glucose');
		expect(b1s[0]?.confidence).toBeCloseTo(1);
	});

	test('searchBiomarkers (partial)', () => {
		let b1s = Biomarker.searchBiomarkers('Leucociti');
		expect(b1s[0]?.item.id).toBe('wbc');
		expect(b1s[0]?.item.translations?.[1]?.name).toBe('Leucociti (globuli bianchi)');
		expect(b1s[0]?.confidence).toBeGreaterThan(0.5);

		b1s = Biomarker.searchBiomarkers('Sg-ERITROCITI');
		expect(b1s[0]?.item.id).toBe('rbc');
		expect(b1s[0]?.item.translations?.[1]?.name).toBe('Eritrociti');
		expect(b1s[0]?.confidence).toBeGreaterThan(0.5);
	});

	test('searchBiomarkers (mispelled)', () => {
		let b1s = Biomarker.searchBiomarkers('glucoze'); // glucose
		expect(b1s[0]?.item.id).toBe('glucose');

		b1s = Biomarker.searchBiomarkers('Glucoso'); // glucosio
		expect(b1s[0]?.item.id).toBe('glucose');

		b1s = Biomarker.searchBiomarkers('ematocreep'); // hematocrit
		expect(b1s[0]?.item.id).toBe('hct');

		b1s = Biomarker.searchBiomarkers('Ematocripo'); // ematocrito
		expect(b1s[0]?.item.id).toBe('hct');

		//	b1s = await searchBiomarkers('Leucocizi'); // leuco
		//	expect(b1s[0].item.id).toBe('wbc');

		//	b1s = await searchBiomarkers('Globuli Bianchi'); // globuli bianchi
		//	expect(b1s[0].item.id).toBe('wbc');

		//	b1s = await searchBiomarkers('Gloculi Biandi'); // globuli bianchi
		//	expect(b1s[0].item.id).toBe('wbc');
	});

	test('parseRange (numerical values)', async () => {
		// from - to
		let res = Range.parseRange('[10-20]');
		expect(res && res.text).toBe('[10 - 20]');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = Range.parseRange('10- 20');
		expect(res && res.text).toBe('[10 - 20]');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = Range.parseRange('10.632 - 20,34');
		expect(res && res.text).toBe('[10.632 - 20.34]');
		expect(res && res.min).toBe(10.632);
		expect(res && res.max).toBe(20.34);

		res = Range.parseRange('10-20');
		expect(res && res.text).toBe('[10 - 20]');
		expect(res && res.min).toBe(10);
		expect(res && res.max).toBe(20);

		res = Range.parseRange('[10.632 - 20,34');
		expect(res).toBeNull();

		// < to
		res = Range.parseRange('[ < 10.50] ');
		expect(res && res.text).toBe('[< 10.5]');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		res = Range.parseRange(' < 10.50 ');
		expect(res && res.text).toBe('[< 10.5]');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		res = Range.parseRange(' ≤ 10.50 ');
		expect(res && res.text).toBe('[< 10.5]');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		res = Range.parseRange(' <= 10.50 ');
		expect(res && res.text).toBe('[< 10.5]');
		expect(res && res.min).toBeUndefined();
		expect(res && res.max).toBe(10.5);

		// > from
		res = Range.parseRange('[ > 10.50] ');
		expect(res && res.text).toBe('[> 10.5]');
		expect(res && res.max).toBeUndefined();
		expect(res && res.min).toBe(10.5);

		res = Range.parseRange(' > 10.50 ');
		expect(res && res.text).toBe('[> 10.5]');
		expect(res && res.max).toBeUndefined();
		expect(res && res.min).toBe(10.5);

		res = Range.parseRange(' ≥ 10.50 ');
		expect(res && res.text).toBe('[> 10.5]');
		expect(res && res.max).toBeUndefined();
		expect(res && res.min).toBe(10.5);

		res = Range.parseRange(' >= 10.50 ');
		expect(res && res.text).toBe('[> 10.5]');
		expect(res && res.max).toBeUndefined();
		expect(res && res.min).toBe(10.5);
	});

	test('parseRange (string values)', async () => {
		let res = Range.parseRange('[ assenti]');
		expect(res && res.text).toBe('[missing]');
		expect(res && res.min).toBe(0);
		expect(res && res.max).toBe(0);

		res = Range.parseRange('Mickey');
		expect(res).toBeNull();
	});

	test('parseValue (numerical)', async () => {
		let res = Biomarker.parseValue('10');
		expect(res && res.value).toBe(10);
		expect(res && res.text).toBeFalsy();

		res = Biomarker.parseValue('10,3200  '); // with comma
		expect(res && res.value).toBe(10.32);
		expect(res && res.text).toBeFalsy();

		res = Biomarker.parseValue(' 010.32100  ');
		expect(res && res.value).toBe(10.321);
		expect(res && res.text).toBeFalsy();
	});

	test('parseValue (strings)', () => {
		let res = Biomarker.parseValue(' assenti  ');
		expect(res && res.value).toBe(0);
		expect(res && res.text).toBe('missing');

		res = Biomarker.parseValue(' positivo  ');
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = Biomarker.parseValue(' Positivo  '); // uppercase
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = Biomarker.parseValue(' Positive');
		expect(res && res.value).toBe(1);
		expect(res && res.text).toBe('positive');

		res = Biomarker.parseValue(' NEGATIVE'); // allcaps
		expect(res && res.value).toBe(0);
		expect(res && res.text).toBe('negative');

		res = Biomarker.parseValue('this is not a value');
		expect(res).toBeNull();
	});

	test('parseUnits', () => {
		let biomarker = Biomarker.getBiomarker('hgb'); // native unit is g/L
		assert(biomarker);

		// parse native unit for biomarker
		let unit = Biomarker.parseUnits('g/L', biomarker);
		expect(unit?.id).toBe('g/L');
		expect(unit?.confidence).toBe(1);

		// parse a unit that can be converted to native unit
		unit = Biomarker.parseUnits('g/100mL', biomarker);
		expect(unit?.id).toBe('g/100mL');
		expect(unit?.conversion).toBe(0.1);
		expect(unit?.confidence).toBe(1);

		// parse a unit that CANNOT be converted to native unit
		unit = Biomarker.parseUnits('%', biomarker);
		expect(unit).toBeNull();

		// parse unparseable strings
		unit = Biomarker.parseUnits('5,0', biomarker);
		expect(unit).toBeNull();
		unit = Biomarker.parseUnits('fake', biomarker);
		expect(unit).toBeNull();
	});

	test('updateBiomarkers', async () => {
		await Biomarker.updateBiomarkers();
	});
});
