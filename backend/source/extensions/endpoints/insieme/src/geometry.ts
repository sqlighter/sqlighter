//
// Basic geometric entities and calculations
//

/** Point has x and y coordinates */
export type Point = { x: number; y: number };

/** Geometric size has width and height */
export type Size = { width: number; height: number };

/** Bounding box has top left, top right, bottom right and bottom left vertexes */
export type BoundingBox = [Point, Point, Point, Point];

/** Distance between two points */
export function getDistance(p1: Point | undefined, p2: Point | undefined): number {
	if (p1 && p2) {
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	return Number.NaN;
}

/** Returns the distance of p0 from the line formed by p1 and p2 */
export function getDistanceFromLine(p1: Point | undefined, p2: Point | undefined, p0: Point | undefined): number {
	if (p1 && p2 && p0) {
		return (
			Math.abs((p2.y - p1.y) * p0.x - (p2.x - p1.x) * p0.y + p2.x * p1.y - p2.y * p1.x) /
			Math.pow(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2), 0.5)
		);
	}
	return Number.NaN;
}

/** Size of bounding box normalized into a rectangle */
export function getBoundingBoxSize(bbox: BoundingBox | undefined): Size {
	if (bbox) {
		const xMax = Math.max(bbox[0].x, bbox[1].x, bbox[2].x, bbox[3].x);
		const xMin = Math.min(bbox[0].x, bbox[1].x, bbox[2].x, bbox[3].x);
		const yMax = Math.max(bbox[0].y, bbox[1].y, bbox[2].y, bbox[3].y);
		const yMin = Math.min(bbox[0].y, bbox[1].y, bbox[2].y, bbox[3].y);
		return { width: xMax - xMin, height: yMax - yMin };
	}
	return { width: Number.NaN, height: Number.NaN };
}
