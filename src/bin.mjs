#!/usr/bin/env node
import nodemon from 'nodemon';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import getConfig from '#internal/getConfig.mjs';

const [_, __, command] = process.argv;

const config = await getConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on('SIGINT', function () {
	console.log('Exiting...');
	process.exit(2);
});

switch (command) {
	case 'start': {
		import(`${__dirname}/internal/server.mjs`);
		break;
	}

	case 'watch': {
		let iteration = 0;
		nodemon({
			script: `${__dirname}/internal/server.mjs`,
			watch: [`./${config.app.dir}`, 'o.config.mjs'],
			ext: 'mjs js json',
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
