import { ServerResponse } from 'http';
import { Request, Response, NextFunction } from 'express';
import { asyncLocalStorage } from '#internal/requestResponseStore';
import { OChildrenRequest } from '#framework/request';

export default function handleWrap(module: () => any, { middleware = false } = {}) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const request: OChildrenRequest = Object.assign({ meta: {} }, req);
		await asyncLocalStorage.run({ request, response: res }, async () => {
			const result = await module();
			if (result instanceof ServerResponse) {
				return result;
			}

			if (middleware) {
				request.meta = result;
				return next();
			} else {
				if (typeof result === 'object' && result != null) {
					return res.json(result);
				} else if (typeof result === 'string' || typeof result === 'number') {
					return res.send(result);
				}
			}
		});
	};
}
