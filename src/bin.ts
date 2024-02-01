#!/usr/bin/env node
import nodemon from 'nodemon';

import getConfig from '#internal/getConfig';
import getDirname, { fileExt } from '#internal/dirname';
import { detectModuleSystem } from '#internal/detectTypeSystem';

const [_, __, command] = process.argv;

async function bin(command: string) {
	const config = await getConfig();
	const moduleSystem = detectModuleSystem();

	if (moduleSystem === 'error') {
		process.exit(1);
	}

	const __dirname = getDirname(moduleSystem);

	process.on('SIGINT', function () {
		console.log('Exiting...');
		process.exit(2);
	});

	switch (command) {
		case 'start': {
			import(`${__dirname}/server.${fileExt}`);
			break;
		}

		case 'watch': {
			let iteration = 0;
			nodemon({
				script: `${__dirname}/server.${fileExt}`,
				watch: [
					`./${config.app.dir}`,
					`${process.cwd()}/o.config.js`,
					`${process.cwd()}/o.config.cjs`,
					`${process.cwd()}/o.config.mjs`,
				],
				ext: 'mjs js cjs json',
				exec: 'node',
				delay: 1000,
			})
				.on('start', () => {
					console.clear();
					console.log(iteration ? 'Restarting...' : 'Starting...');
					iteration++;
				})
				.on('crash', () => console.error('script crashed for some reason'));
			break;
		}

		default:
			console.log('Unknown command');
			break;
	}
}

bin(command);
