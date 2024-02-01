import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import handleWrap from '#internal/handleWrap';
import { fileExtRegexp } from '#internal/dirname';

async function makeRouter(dirPath: string) {
	const router = express.Router();

	const dirContent = await fs.readdir(dirPath, { withFileTypes: true });

	for (const item of dirContent) {
		const name = item.name;
		if (item.isDirectory()) {
			const itemRouter = await makeRouter(path.join(dirPath, name));
			router.use(`/${name}`, itemRouter);
		} else {
			const clearName = name.replace(fileExtRegexp, '');
			const route = clearName === 'index' ? '' : `/${clearName}`;
			const module = await import(path.join(dirPath, name));

			if (clearName === '_middleware') {
				router.use(handleWrap(module.default, { middleware: true }));
			}

			for (const method of methods) {
				if (method in module && typeof module[method] === 'function') {
					router[methodsMap[method]](route, handleWrap(module[method]));
				}
			}
		}
	}

	return router;
}

export default makeRouter;

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

const methodsMap = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete',
} as const;
