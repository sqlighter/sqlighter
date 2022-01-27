//
// index.ts
//

import { defineEndpoint } from '@directus/extensions-sdk';
import { Request, Response, NextFunction, Router } from 'express';
const packageJson = require('./package.json');

export default defineEndpoint((router: Router, { services, exceptions }) => {
	const { ItemsService } = services;
	const { ServiceUnavailableException } = exceptions;

	router.get('/', (req: Request | any, res: Response, next: NextFunction) => {
		const recipeService = new ItemsService('posts', { schema: req.schema, accountability: req.accountability });
		recipeService
			.readByQuery({ fields: ['*.*'] })
			.then(function (results: any) {
				return res.json(results);
			})
			.catch(function (error: any) {
				return next(new ServiceUnavailableException(error.message));
			});
	});

	router.get('/', (_req, res) => res.send('Hello, World!'));

	/** Package that was built */
	router.get('/version', (req: Request, res: Response) => {
		const { name, author, version } = packageJson;
		res.json({ name, author, version });
	});
});
