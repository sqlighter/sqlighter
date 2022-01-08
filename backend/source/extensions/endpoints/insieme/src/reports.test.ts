// scan.ts tests
import { getGoogleVisionAnnotations, normalizeGoogleVisionAnnotations, annotationsToHtml, processAnnotations } from './reports';
const { resolve } = require('path');
import fs from 'fs/promises';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

const TEST_PDF_PATH = "assets/analisi02.pdf"

describe('reports tests', () => {
	test('getGoogleVisionAnnotations (pdf from local file)', async () => {
		const sourcePath = resolve(TEST_PDF_PATH);
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
		const sourceUri = 'gs://insieme/test/analisi02.pdf';
		const results = await getGoogleVisionAnnotations(sourceUri);

		expect(results).toBeTruthy();
		expect(results.length).toBe(2);
		expect(results[0].fullTextAnnotation).toBeTruthy();
		expect(results[0].fullTextAnnotation.text).toContain('AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA');
		expect(results[1].fullTextAnnotation).toBeTruthy();
	});

	test('normalizeAnnotations', async () => {
		const sourcePath = resolve(TEST_PDF_PATH + '.googlevision.json');
		const googleAnnotations = JSON.parse((await fs.readFile(sourcePath)).toString());
		const annotations = await normalizeGoogleVisionAnnotations(googleAnnotations);

		expect(annotations).toBeTruthy();
		expect(annotations.pages.length).toBe(2);

		for (const page of annotations.pages) {
			expect(page.width).toBe(594);
			expect(page.height).toBe(841);
			expect(page.pageNumber).toBeGreaterThan(0);
			expect(page.languages[0]?.languageCode).toBe('it');
			expect(page.languages[0]?.confidence).toBeGreaterThan(0.5);
			expect(page.words?.length).toBeGreaterThan(20);

			const svg = annotationsToHtml(annotations, page.pageNumber);
			const svgPath = resolve(TEST_PDF_PATH + `.p${page.pageNumber}-before.html`);
			await fs.writeFile(svgPath, svg);
		}

		await processAnnotations(annotations);
		const normalizedPath = resolve(TEST_PDF_PATH + '.normalized.json');
		await fs.writeFile(normalizedPath, JSON.stringify(annotations));

		for (const page of annotations.pages) {
			const svg = annotationsToHtml(annotations, page.pageNumber);
			const svgPath = resolve(`assets/analisi02.pdf.p${page.pageNumber}-after.html`);
			await fs.writeFile(svgPath, svg);
		}
	});
});
