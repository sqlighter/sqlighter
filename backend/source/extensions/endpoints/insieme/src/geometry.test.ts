// geometry.ts tests
import { Point, BoundingBox,getDistance, getDistanceFromLine, getBoundingBoxSize } from "./geometry"

describe('geometry.ts', () => {
	test('getDistance', async () => {
        const d1 = getDistance({x:0, y:0}, {x:2, y:2});
        expect(d1).toBeCloseTo(Math.sqrt(2*2+2*2));

        const d2 = getDistance({x:2, y:2}, {x:4, y:4});
        expect(d2).toBeCloseTo(Math.sqrt(2*2+2*2));

        const d3 = getDistance({x:-2, y:2}, {x:0, y:0});
        expect(d3).toBeCloseTo(Math.sqrt(2*2+2*2));
    });

	test('getDistanceFromLine', async () => {
        const d1 = getDistanceFromLine({x:-2, y:1}, {x:4, y:1}, {x:3, y:-3});
        expect(d1).toBe(4);

        const d2 = getDistanceFromLine({x:-2, y:1}, {x:4, y:1}, {x:-8, y:-2});
        expect(d2).toBe(3);

        const d3 = getDistanceFromLine({x:-2, y:1}, {x:4, y:1}, {x:5, y:3});
        expect(d3).toBe(2);

        const d4 = getDistanceFromLine({x:-2, y:-2}, {x:4, y:4}, {x:1, y:2});
        expect(d4).toBeCloseTo(0.7071);
    });
});
