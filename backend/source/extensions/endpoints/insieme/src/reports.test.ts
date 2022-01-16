// scan.ts tests

import { resolve } from 'path';
import fs from 'fs/promises';
import { Ocr }  from "./ocr"
import { Report } from './reports';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

const TEST_PDF_PATH = "./test/analisi02.pdf"
function toArtifacts(path:string) {
	return resolve(path).replace("/test/", "/test/artifacts/")
}

describe('reports.ts', () => {
	test('Report.analyzeOcr', async () => {
		// file created by ocr.test.ts
		const sourcePath = toArtifacts(TEST_PDF_PATH + '.ocr.json');
		const rawOcr = JSON.parse((await fs.readFile(sourcePath)).toString());
		const pages = Ocr.normalizeAnnotations(rawOcr);

		expect(pages).toBeTruthy();
		expect(pages.length).toBe(2);
		const report = new Report(pages);

		for (const page of pages) {
			expect(page.width).toBe(594);
			expect(page.height).toBe(841);
			expect(page.pageNumber).toBeGreaterThan(0);
			expect(page.locale).toBe('it');
			expect(page.words?.length).toBeGreaterThan(20);

			const svg = report.toHtml(page.pageNumber);
			const svgPath = toArtifacts(TEST_PDF_PATH + `.page${page.pageNumber}.before.html`);
			await fs.writeFile(svgPath, svg);
		}

		await report.analyzeOcr();
		const normalizedPath = toArtifacts(TEST_PDF_PATH + '.report.json');
		await fs.writeFile(normalizedPath, JSON.stringify(report, null, '  '));

		for (const page of report.pages) {
			const svg = report.toHtml(page.pageNumber);
			const svgPath = toArtifacts(TEST_PDF_PATH + `.page${page.pageNumber}.after.html`);
			await fs.writeFile(svgPath, svg);
		}
	});
});
