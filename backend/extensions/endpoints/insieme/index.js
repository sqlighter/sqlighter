// index.js - custom routes for insieme

var biomarkers = require('../../../../docs/biomarkers/biomarker-types.json');

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

	router.get('/initialize', async (req, res, next) => {
		const unitsService = new ItemsService('units', { schema: req.schema, accountability: req.accountability });

		const units = {};
		biomarkers.forEach((biomarker) => {
			if (biomarker.Units) {
				units[biomarker.Units] = null;
			}
		});
		//        console.log(units);

        var manyUnits = await unitsService.readMany();
        res.json(manyUnits);

        for(var unit in units) {
			console.log(unit);

            var oldUnit = await unitsService.readOne(unit);
			console.log(oldUnit);
            if (!oldUnit) {
                var newUnit = await unitsService.createOne({
                    id: unit,
                })
            }
        }

//		Object.keys(units).forEach(async (unit) => {
//		});

		const biomaService = new ItemsService('posts', { schema: req.schema, accountability: req.accountability });

		biomarkers.forEach((biomarker) => {
			//            console.log(biomarker.Code);
		});

		res.json(biomarkers);
        
	});
};

exports.default = route;

// index.js - load ecmascript directly
// require = require('esm')(module);
// module.exports = require('./endpoint.js');
// in endpoint.js...
// export default (router, { services, exceptions }) => { ... }
