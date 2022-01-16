//
// ocr.test.ts
//

import { resolve } from 'path';
import fs from 'fs/promises';
import { Ocr } from './ocr';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

const TEST_PDF_PATH = './test/analisi02.pdf';
function toArtifacts(path:string) {
	return resolve(path).replace("/test/", "/test/artifacts/")
}

describe('ocr.ts', () => {
	test('getOcrAnnotations (pdf from local file)', async () => {
		const sourcePath = resolve(TEST_PDF_PATH);
		const { pages, rawOcr, extras } = await Ocr.scanPages(sourcePath);

		expect(rawOcr).toBeTruthy();
		expect(rawOcr.length).toBe(2);
		expect(rawOcr[0].fullTextAnnotation).toBeTruthy();
		expect(rawOcr[0].fullTextAnnotation.text).toContain('AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA');
		expect(rawOcr[1].fullTextAnnotation).toBeTruthy();

		expect(pages).toBeTruthy();
		expect(pages.length).toBe(2);
		for (const page of pages) {
			expect(page).toBeTruthy();
			expect(page?.width).toBe(594);
			expect(page?.height).toBe(841);
			expect(page.locale).toBe('it');
		}

		const destinationPath = toArtifacts(sourcePath + '.ocr.json');
		await fs.writeFile(destinationPath, JSON.stringify(rawOcr));
	});

	test('getOcrAnnotations (pdf from google storage)', async () => {
		const sourceUri = 'gs://insieme/test/analisi02.pdf';
		const { pages, rawOcr, extras } = await Ocr.scanPages(sourceUri);

		expect(rawOcr).toBeTruthy();
		expect(rawOcr.length).toBe(2);
		expect(rawOcr[0].fullTextAnnotation).toBeTruthy();
		expect(rawOcr[0].fullTextAnnotation.text).toContain('AZIENDA OSPEDALIERA UNIVERSITARIA INTEGRATA');
		expect(rawOcr[1].fullTextAnnotation).toBeTruthy();

		expect(pages).toBeTruthy();
		expect(pages.length).toBe(2);
		for (const page of pages) {
			expect(page).toBeTruthy();
			expect(page?.width).toBe(594);
			expect(page?.height).toBe(841);
			expect(page.locale).toBe('it');
		}
	});
});
