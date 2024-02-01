import path from 'path';

import express from 'express';

import getConfig from '#internal/getConfig';
import makeRouter from '#internal/makeRouter';

export default async function makeServer() {
	const config = await getConfig();

	const mainRouter = await makeRouter(path.join(process.cwd(), config.app.dir));

	const app = express();

	app.use((req, res, next) => {
		res.set('X-Powered-By', 'O-Children');
		next();
	});

	app.use(mainRouter);

	const serverArgs = [config.server.port, config.server.host].filter(Boolean);

	const listenCallback = () => console.log(`Server started on ${serverArgs.join(':')}`);

	if (config.server.host) {
		app.listen(config.server.port, config.server.host, listenCallback);
	} else {
		app.listen(config.server.port, listenCallback);
	}

	return app;
}
