import { defineEndpoint } from '@directus/extensions-sdk';

// index.js - custom routes for insieme
import { Request, Response, NextFunction, Router } from 'express';

import { addOne } from './pino';

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

	router.get('/version', (req: Request, res: Response) => {
		const version = addOne(9);
		res.json({ version: `v${version}`, method: req.method });
	});
});
