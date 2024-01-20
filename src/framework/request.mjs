import { asyncLocalStorage } from '#internal/handleWrap.mjs';

/**
 * @returns {import('express').Request} - Express request object
 */
export const request = () => {
	const { req } = asyncLocalStorage.getStore();
	return req;
};

export const params = () => {
	const params = request().params;

	return {
		get: (name) => {
			return params[name];
		},
		has: (name) => {
			return params[name] != null;
		},
		getAll: () => {
			return params;
		},
		keys: () => {
			return Object.keys(params);
		},
	};
};

export const queries = () => {
	const query = request().query;

	return {
		get: (name) => {
			return query[name];
		},
		has: (name) => {
			return query[name] != null;
		},
		getAll: () => {
			return query;
		},
		keys: () => {
			return Object.keys(query);
		},
	};
};

export const body = () => {
	const body = request().body;

	return {
		get: (name) => {
			return body[name];
		},
		has: (name) => {
			return body[name] != null;
		},
		getAll: () => {
			return body;
		},
		keys: () => {
			return Object.keys(body);
		},
	};
};

export const meta = () => {
	return Object.assign({}, request().meta);
};
