// units.ts tests
import { Unit, UNITS_SEARCH_CONFIDENCE } from './units';

describe('units.ts', () => {
	test('getUnits', async () => {
		const units = Unit.getUnits();
		expect(units).toBeTruthy();
		expect(units.length).toBeGreaterThan(10);
		expect(units[0]?.toString()).toContain(':');
	});

	test('getUnit', async () => {
		const u1 = Unit.getUnit('μg/L');
		expect(u1).toBeTruthy();
		if (u1) {
			expect(u1 instanceof Unit).toBeTruthy();
			expect(u1.description).toBe('micrograms per liter');
			expect(u1.aliases).toContain('ug/L');
			expect(u1.aliases).toContain('mcg/L');
			expect(u1.conversions['mg/L']).toBe(0.001);
			expect(u1.toString()).toBe('μg/L: micrograms per liter');
		}
	});

	test('searchUnit', async () => {
		const matches = Unit.searchUnits('μg/L');
		expect(matches).toBeTruthy();
		expect(matches.length).toBeGreaterThanOrEqual(1);
		expect(matches[0]?.confidence).toBeGreaterThanOrEqual(UNITS_SEARCH_CONFIDENCE);

		const u1 = matches[0]?.item;
		expect(u1).toBeTruthy();
		if (u1) {
			expect(u1 instanceof Unit).toBeTruthy();
			expect(u1.description).toBe('micrograms per liter');
			expect(u1.aliases).toContain('ug/L');
			expect(u1.aliases).toContain('mcg/L');
			expect(u1.conversions['mg/L']).toBe(0.001);
			expect(u1.toString()).toBe('μg/L: micrograms per liter');
		}
	});
});
