import path from 'path';
import express from 'express';
import getConfig from '#internal/getConfig.mjs';
import makeRouter from '#internal/makeRouter.mjs';

const config = await getConfig();

const mainRouter = await makeRouter(path.join(process.cwd(), config.app.dir));

const app = express();

app.use((req, res, next) => {
	res.set('X-Powered-By', 'O-Children');
	next();
});

app.use(mainRouter);

const serverArgs = [config.server.port, config.server.host].filter(Boolean);

await app.listen(...serverArgs);

console.log(`Server started on ${serverArgs.join(':')}`);
