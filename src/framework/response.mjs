import { asyncLocalStorage } from '#internal/handleWrap.mjs';

/**
 * @returns {import('express').Response} - Express response object
 */
export const response = () => {
	const { res } = asyncLocalStorage.getStore();
	return res;
};

export const json = (data) => {
	return response().json(data);
};

export const send = (data) => {
	return response().send(data);
};

export const status = (code) => {
	return response().status(code);
};

export const redirect = (url) => {
	return response().redirect(url);
};
