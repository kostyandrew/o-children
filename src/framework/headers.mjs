import { request } from '#framework/request.mjs';
import { response } from '#framework/response.mjs';

export const headers = () => {
	return {
		request: {
			get: (name) => {
				return request().headers[name];
			},
			getAll: () => {
				return request().headers;
			},
			has: (name) => {
				return request().headers[name] != null;
			},
			keys: () => {
				return Object.keys(request().headers);
			},
		},
		response: {
			get: (name) => {
				return response().getHeader(name);
			},
			getAll: () => {
				return response().getHeaders();
			},
			has: (name) => {
				return response().hasHeader(name);
			},
			keys: () => {
				return response().getHeaderNames();
			},
			set: (name, value) => {
				response().setHeader(name, value);
			},
			delete: (name) => {
				response().removeHeader(name);
			},
		},
	};
};

export const cookies = () => {
	return {
		request: {
			get: (name) => {
				return request().cookies[name];
			},
			getAll: () => {
				return request().cookies;
			},
			has: (name) => {
				return request().cookies[name] != null;
			},
			keys: () => {
				return Object.keys(request().cookies);
			},
		},
		response: {
			set: (name, value, options) => {
				return response().cookie(name, value, options);
			},
			delete: (name, options) => {
				return response().clearCookie(name, options);
			},
		},
	};
};
