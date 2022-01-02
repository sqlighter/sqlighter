// index.js - custom routes for insieme

var biomarkers = require('../../../../docs/biomarkers/biomarker-types.json');

function ifNotNull(value) {
    return value && value != "NULL" ? value : null
}

var route = (router, { services, exceptions }) => {
	const { ItemsService } = services;
	const { ServiceUnavailableException } = exceptions;

	router.get('/', (req, res, next) => {
		const recipeService = new ItemsService('posts', { schema: req.schema, accountability: req.accountability });

		recipeService
			.readByQuery({ fields: ['*.*'] })
			.then((results) => res.json(results))
			.catch((error) => {
				return next(new ServiceUnavailableException(error.message));
			});
	});

	router.get('/version', (req, res, next) => {
		res.json({ version: 3 });
	});

	router.get('/setup-biomarkers', async (req, res, next) => {
		const unitsService = new ItemsService('units', { schema: req.schema, accountability: req.accountability });
		const biomarkersService = new ItemsService('biomarkers', {
			schema: req.schema,
			accountability: req.accountability,
		});

		// find unique units
		const units = {};
		biomarkers.forEach((biomarker) => {
			if (biomarker.Units) {
				units[biomarker.Units] = null;
			}
		});

		// create any missing measurement units
		var allUnits = await unitsService.readMany();
		for (var unit in units) {
			console.log(unit);
			var oldUnit = allUnits.find((existingUnit) => existingUnit.id.toLowerCase() == unit.toLowerCase());
			if (!oldUnit) {
				console.log(`will insert new unit ${unit}`);
				var newUnit = await unitsService.createOne({
					id: unit,
				});
			}
		}

		// create missing biomarkers
		var allBiomarkers = await biomarkersService.readMany();
		for (var biomarkerIdx in biomarkers) {
            var biomarker = biomarkers[biomarkerIdx]
			console.log(unit);
			var oldBiomarker = allBiomarkers.find(
				(existingBiomarker) => existingBiomarker.id.toLowerCase() == biomarker.Code.toLowerCase()
			);
			if (!oldBiomarker) {


				console.log(`will insert new biomarker ${biomarker.Code}`);
				var newBiomarker = await biomarkersService.createOne({
					id: biomarker.Code.toLowerCase(),
					units: ifNotNull(biomarker.Units),
					risks: ifNotNull(biomarker.Risk),
					translations: [
						{
							languages_code: 'en-US',
							name: ifNotNull(biomarker.Name),
                            description: ifNotNull(biomarker.Description),
                            summary: ifNotNull(biomarker.Summary)
						},
					],
				});
			}
		}

        allBiomarkers = await biomarkersService.readMany();
		res.json(allBiomarkers);
	});
};

exports.default = route;

// index.js - load ecmascript directly
// require = require('esm')(module);
// module.exports = require('./endpoint.js');
// in endpoint.js...
// export default (router, { services, exceptions }) => { ... }
