// scan.ts tests

import { resolve } from 'path';
import fs from 'fs/promises';
import path from 'path';

import { Ocr } from './ocr';
import { Report } from './reports';
import { assert } from 'console';

// external APIs require longer timeouts
jest.setTimeout(30 * 1000);

describe('reports.ts', () => {
	// the test directory contains a number of xxx.pdf and xxx.pdf.report.json
	// files where the second file contains a completed report containing the
	// biomarkers that are expected to be found in the report. we can analyze
	// the pdf and then match against the expected results to see if anything
	// has gone missing

	test('Report.analyzeOcr (report01.pdf)', async () => {
		await analyzePdf('report01.pdf');
	});
	test('Report.analyzeOcr (report02.pdf)', async () => {
		await analyzePdf('report02.pdf');
	});
});

async function analyzePdf(file: string) {
	// the test directory contains a number of xxx.pdf and xxx.pdf.report.json
	// files where the second file contains a completed report containing the
	// biomarkers that are expected to be found in the report. we can analyze
	// the pdf and then match against the expected results to see if anything
	// has gone missing
	const pdfFile = path.resolve('./test/' + file);
	const expectedFile = toArtifacts(pdfFile + '.expected.json');
	const ocrFile = toArtifacts(pdfFile + '.ocr.json');
	console.log(`checking file ${pdfFile}`);

	// if the ocr file is missing just create it once, we don't need to test ocr over and over
	let rawOcr;
	try {
		rawOcr = JSON.parse((await fs.readFile(ocrFile)).toString());
	} catch {
		let scan = await Ocr.scanPages(pdfFile);
		rawOcr = scan.rawOcr;
		expect(rawOcr).toBeTruthy();
		const ocrJson = JSON.stringify(rawOcr, null, '  ');
		await fs.writeFile(ocrFile, ocrJson);
		console.warn(`${ocrFile} was missing and has been generated`);
	}

	// now analyze the ocr file, produce biomarkers and test expected results
	const pages = Ocr.normalizeAnnotations(rawOcr);
	let report = new Report(pages);
	for (const page of pages) {
		const svg = report.toHtml(page.pageNumber);
		const svgPath = toArtifacts(pdfFile + `.page${page.pageNumber}.before.html`);
		await fs.writeFile(svgPath, svg);
	}

	await report.analyzeOcr();
	for (const page of report.pages) {
		const svg = report.toHtml(page.pageNumber);
		const svgPath = toArtifacts(pdfFile + `.page${page.pageNumber}.after.html`);
		await fs.writeFile(svgPath, svg);
	}

	// write actual report to artifacts, stringify/parse report so it's comparable
	const reportJson = JSON.stringify(report);
	const reportFile = toArtifacts(pdfFile + '.actual.json');
	await fs.writeFile(reportFile, reportJson);
	report = JSON.parse(JSON.stringify(report)); // parse via json so is comparable to .report.json

	let expectedReport;
	try {
		expectedReport = JSON.parse((await fs.readFile(expectedFile)).toString());
	} catch (error) {
		// to simplify adding new reports we save the current results which can be hand edited, etc
		await fs.writeFile(expectedFile, JSON.stringify(report, null, '  '));
		console.warn(`${expectedFile} was missing and has been generated`);
		expectedReport = JSON.parse((await fs.readFile(expectedFile)).toString());
	}

	// check pages
	const expectedPages = expectedReport.pages;
	expect(pages).toBeTruthy();
	expect(pages.length).toBe(expectedPages.length);

	for (const i in pages) {
		const p1 = pages[i];
		const p2 = expectedPages[i];
		expect(p1).toBeTruthy();
		expect(p2).toBeTruthy();
		if (p1 != null && p2 != null) {
			expect(p1.width).toBeGreaterThan(1);
			expect(p1.width).toBe(p2.width);
			expect(p1.height).toBeGreaterThan(1);
			expect(p1.height).toBe(p2.height);
			expect(p1.pageNumber).toBe(parseInt(i) + 1);
			expect(p1.locale).toBe(p2.locale);
		}
	}

	// check measurements
	const numBiomarkers = expectedReport.biomarkers?.length;
	expect(numBiomarkers).toBeGreaterThan(0);
	expect(report.biomarkers?.length).toBe(numBiomarkers);
	if (report.biomarkers && expectedReport.biomarkers) {
		for (let i = 0; i < numBiomarkers; i++) {
			const bActual = report.biomarkers[i];
			const bExpected = expectedReport.biomarkers[i];

			expect(bActual?.biomarker).toBe(bExpected.biomarker);
			expect(bActual?.value).toBe(bExpected.value);
			expect(bActual?.range).toBe(bExpected.range);
			expect(bActual?.unit).toBe(bExpected.unit);
		}
	}
}

const TEST_PDF_PATH = './test/analisi02.pdf';
function toArtifacts(path: string) {
	return resolve(path).replace('/test/', '/test/artifacts/');
}
