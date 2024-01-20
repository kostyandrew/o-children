import AsyncLocalStorage from 'async_hooks';
import { ServerResponse } from 'http';

export const asyncLocalStorage = new AsyncLocalStorage.AsyncLocalStorage();
export default function handleWrap(module, { middleware = false } = {}) {
	return async (req, res, next) => {
		await asyncLocalStorage.run({ req, res }, async () => {
			const result = await module();
			if (result instanceof ServerResponse) {
				return result;
			}

			if (middleware) {
				req.meta = result;
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
