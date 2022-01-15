// scan.ts tests

import { resolve } from 'path';
import fs from 'fs/promises';
import { normalizeOcrAnnotations} from "./ocr"
import { Report, annotationsToHtml } from './reports';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

const TEST_PDF_PATH = "./test/analisi02.pdf"
function toArtifacts(path:string) {
	return resolve(path).replace("/test/", "/test/artifacts/")
}

describe('reports.ts', () => {
	test('Report.processOcr', async () => {
		// file created by ocr.test.ts
		const sourcePath = toArtifacts(TEST_PDF_PATH + '.ocr.json');
		const rawOcr = JSON.parse((await fs.readFile(sourcePath)).toString());
		const pages = normalizeOcrAnnotations(rawOcr);

		expect(pages).toBeTruthy();
		expect(pages.length).toBe(2);

		for (const page of pages) {
			expect(page.width).toBe(594);
			expect(page.height).toBe(841);
			expect(page.pageNumber).toBeGreaterThan(0);
			expect(page.locale).toBe('it');
			expect(page.words?.length).toBeGreaterThan(20);

			const svg = annotationsToHtml(page);
			const svgPath = toArtifacts(TEST_PDF_PATH + `.page${page.pageNumber}.before.html`);
			await fs.writeFile(svgPath, svg);
		}

		const report = new Report(pages);
		await report.analyzeOcr();
		const normalizedPath = toArtifacts(TEST_PDF_PATH + '.report.json');
		await fs.writeFile(normalizedPath, JSON.stringify(report, null, '\t'));

		for (const page of report.pages) {
			const svg = annotationsToHtml(page);
			const svgPath = toArtifacts(TEST_PDF_PATH + `.page${page.pageNumber}.after.html`);
			await fs.writeFile(svgPath, svg);
		}
	});
});
