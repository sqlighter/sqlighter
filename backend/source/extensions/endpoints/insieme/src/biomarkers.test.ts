// biomarkers.ts test
import { searchBiomarkers } from './biomarkers';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

describe('biomarkers.ts', () => {
	test('searchBiomarkers (exact)', async () => {
		let b1s = await searchBiomarkers('glucose');
		expect(b1s[0].item.id).toBe('glucose');
		expect(b1s[0].item.translations[0].name).toBe('Glucose');
		expect(b1s[0].score).toBeCloseTo(0);

		b1s = await searchBiomarkers('Glucosio');
		expect(b1s[0].item.id).toBe('glucose');
		expect(b1s[0].item.translations[1].name).toBe('Glucosio');
		expect(b1s[0].score).toBeCloseTo(0);

		b1s = await searchBiomarkers('Urine Glucose');
		expect(b1s[0].item.id).toBe('urine-glu');
		expect(b1s[0].item.translations[0].name).toBe('Urine Glucose');
		expect(b1s[0].score).toBeCloseTo(0);
	});

	test('searchBiomarkers (partial)', async () => {
		let b1s = await searchBiomarkers('Leucociti');
		expect(b1s[0].item.id).toBe('wbc');
		expect(b1s[0].item.translations[1].name).toBe('Leucociti (globuli bianchi)');
		expect(b1s[0].score).toBeLessThan(0.5);
	});

	test('searchBiomarkers (mispelled)', async () => {
		let b1s = await searchBiomarkers('glucoze'); // glucose
		expect(b1s[0].item.id).toBe('glucose');

		b1s = await searchBiomarkers('Glucoso'); // glucosio
		expect(b1s[0].item.id).toBe('glucose');

		b1s = await searchBiomarkers('ematocreep'); // hematocrit
		expect(b1s[0].item.id).toBe('hct');

		b1s = await searchBiomarkers('Ematocripo'); // ematocrito
		expect(b1s[0].item.id).toBe('hct');

	//	b1s = await searchBiomarkers('Leucocizi'); // leuco
	//	expect(b1s[0].item.id).toBe('wbc');

	//	b1s = await searchBiomarkers('Globuli Bianchi'); // globuli bianchi
	//	expect(b1s[0].item.id).toBe('wbc');

	//	b1s = await searchBiomarkers('Gloculi Biandi'); // globuli bianchi
	//	expect(b1s[0].item.id).toBe('wbc');
	});
});
