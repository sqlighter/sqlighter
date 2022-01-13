//
// Basic geometric entities and calculations
//

// https://www.npmjs.com/package/set-clustering
const cluster = require('set-clustering');

/** Point has x and y coordinates */
export type Point = [number, number];

/** Geometric size has width and height */
export type Size = { width: number; height: number };

/** Bounding box has top left, top right, bottom right and bottom left vertexes */
export type BoundingBox = [Point, Point, Point, Point];

/** Returns the average coordinates of the given array of points */
export function getAverage(...points: Point[]): Point {
	return [
		points.reduce((a, b) => a + b[0], 0) / points.length, // x
		points.reduce((a, b) => a + b[1], 0) / points.length, // y
	];
}

/** Distance between two points */
export function getDistance(p1: Point | undefined, p2: Point | undefined): number {
	if (p1 && p2) {
		const dx = p1[0] - p2[0];
		const dy = p1[1] - p2[1];
		return Math.sqrt(dx * dx + dy * dy);
	}
	return Number.NaN;
}

/** Returns the distance of p0 from the line formed by p1 and p2 */
export function getDistanceFromLine(p1: Point | undefined, p2: Point | undefined, p0: Point | undefined): number {
	if (p1 && p2 && p0) {
		return (
			Math.abs((p2[1] - p1[1]) * p0[0] - (p2[0] - p1[0]) * p0[1] + p2[0] * p1[1] - p2[1] * p1[0]) /
			Math.pow(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2), 0.5)
		);
	}
	return Number.NaN;
}

/** Size of bounding box normalized into a rectangle */
export function getBoundingBoxSize(bbox: BoundingBox | undefined): Size {
	if (bbox) {
		const xMax = Math.max(bbox[0][0], bbox[1][0], bbox[2][0], bbox[3][0]);
		const xMin = Math.min(bbox[0][0], bbox[1][0], bbox[2][0], bbox[3][0]);
		const yMax = Math.max(bbox[0][1], bbox[1][1], bbox[2][1], bbox[3][1]);
		const yMin = Math.min(bbox[0][1], bbox[1][1], bbox[2][1], bbox[3][1]);
		return { width: xMax - xMin, height: yMax - yMin };
	}
	return { width: Number.NaN, height: Number.NaN };
}

function largestCluster(values: number[]): { value: number; count: number; confidence: number } {
	const normalizer = 1000;
	let min = Math.min(...values),
		max = Math.max(...values);

	const normalizedValues = values.map((v) => (v - min) * (normalizer / (max - min)));
	const valuesCluster = cluster(normalizedValues, (e1: number, e2: number) => 1 / Math.pow(e1 - e2, 2));

	const groups = valuesCluster.similarGroups(0.4);
	const sortedGroups = groups.sort((a: [], b: []) => b.length - a.length);

	const average = sortedGroups[0].reduce((a: number, b: number) => a + b, 0) / sortedGroups[0].length;
	const value = average / (normalizer / max);

	const participation = sortedGroups[0].length / values.length;
	const precision = 1 - 1 / (normalizer - Math.sqrt(sortedGroups[0].reduce((a: number, b: number) => a + Math.pow(b - average, 2), 0)));
	return { value, count: sortedGroups[0].length, confidence: participation * precision };
}

export function getBoundingBoxAlignments(bboxes: BoundingBox[]) {
	let alignments = [];

	// right
	const rights = bboxes.map((bbox) => (bbox[1][0] + bbox[2][0]) / 2);
	alignments.push({ align: 'right', ...largestCluster(rights) });
	// left
	const lefts = bboxes.map((bbox) => (bbox[0][0] + bbox[3][0]) / 2);
	alignments.push({ align: 'left', ...largestCluster(lefts) });
	// center
	const centers = bboxes.map((bbox) => (bbox[0][0] + bbox[1][0] + bbox[2][0] + bbox[3][0]) / 4);
	alignments.push({ align: 'center', ...largestCluster(centers) });
	// top
	const tops = bboxes.map((bbox) => (bbox[0][1] + bbox[1][1]) / 2);
	alignments.push({ align: 'top', ...largestCluster(tops) });
	// bottom
	const bottoms = bboxes.map((bbox) => (bbox[2][1] + bbox[3][1]) / 2);
	alignments.push({ align: 'bottom', ...largestCluster(bottoms) });

	alignments = alignments.sort((a, b) => b.confidence - a.confidence);
	return alignments;
}

export function mergeBoundingBoxes(bboxes: BoundingBox[]): BoundingBox {
	let minX = Number.MAX_VALUE,
		maxX = Number.MIN_VALUE,
		minY = Number.MAX_VALUE,
		maxY = Number.MIN_VALUE;
	bboxes.forEach((bbox) => {
		if (bbox) {
			bbox.forEach((p) => {
				if (p[0] < minX) minX = p[0];
				if (p[0] > maxX) maxX = p[0];
				if (p[1] < minY) minY = p[1];
				if (p[1] > maxY) maxY = p[1];
			});
		}
	});
	return [
		[minX, maxY], // topLeft
		[maxX, maxY], // topRight
		[maxX, minY], // bottomRight
		[minX, minY], // bottomLeft
	];
}

export function bboxToString(bbox: BoundingBox) {
	return '[' + bbox.map((p) => `[${p[0]},${p[1]}]`).join(', ') + ']';
}
