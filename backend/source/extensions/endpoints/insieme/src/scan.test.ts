// scan.ts tests
import { getGoogleVisionAnnotations, normalizeGoogleVisionAnnotations, annotationsToHtml } from './scan';
const { resolve } = require('path');
import fs from 'fs/promises';
import exp from 'constants';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

describe('scan tests', () => {
	test('getGoogleVisionAnnotations (pdf from local file)', async () => {
		const sourcePath = resolve('assets/analisi01.pdf');
		const results = await getGoogleVisionAnnotations(sourcePath);

		expect(results).toBeTruthy();
		expect(results.length).toBe(2);
		expect(results[0].fullTextAnnotation).toBeTruthy();
		expect(results[0].fullTextAnnotation.text).toContain('AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA');
		expect(results[1].fullTextAnnotation).toBeTruthy();

		const destinationPath = sourcePath + '.googlevision.json';
		await fs.writeFile(destinationPath, JSON.stringify(results));
	});

	test('getGoogleVisionAnnotations (pdf from google storage)', async () => {
		const sourceUri = 'gs://insieme/f0a29218-269b-42a8-95b7-2da2d5b46bf7.pdf';
		const results = await getGoogleVisionAnnotations(sourceUri);

		expect(results).toBeTruthy();
		expect(results.length).toBe(2);
		expect(results[0].fullTextAnnotation).toBeTruthy();
		expect(results[0].fullTextAnnotation.text).toContain('AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA');
		expect(results[1].fullTextAnnotation).toBeTruthy();
	});

	test('normalizeAnnotations', async () => {
		const sourcePath = resolve('assets/analisi01.pdf.googlevision.json');
		const googleAnnotations = JSON.parse((await fs.readFile(sourcePath)).toString());
		const annotations = await normalizeGoogleVisionAnnotations(googleAnnotations);

		expect(annotations).toBeTruthy();
		expect(annotations.pages.length).toBe(2);

		for (const page of annotations.pages) {
			expect(page.width).toBe(595);
			expect(page.height).toBe(842);
			expect(page.pageNumber).toBeGreaterThan(0);
			expect(page.detectedLanguages[0].languageCode).toBe('it');
			expect(page.detectedLanguages[0].confidence).toBeGreaterThan(0.5);
			expect(page.words.length).toBeGreaterThan(20);

			const svg = annotationsToHtml(annotations, page.pageNumber);
			const svgPath = resolve(`assets/analisi01.pdf.p${page.pageNumber}.html`);
			await fs.writeFile(svgPath, svg);
		}

		expect(1).toBe(1);
	});
});
