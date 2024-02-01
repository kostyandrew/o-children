import { getStore } from '#internal/requestResponseStore';
import { ParsedQs } from 'qs';
import { Request } from 'express';

export type OChildrenRequest = Request & {
	meta: unknown;
};

export const request = (): OChildrenRequest => {
	return getStore().request;
};

export const params = () => {
	const params = request().params;

	return {
		get: (name: string): string | undefined => {
			return params[name];
		},
		has: (name: string): boolean => {
			return params[name] != null;
		},
		getAll: (): { [key: string]: string } => {
			return params;
		},
		keys: (): string[] => {
			return Object.keys(params);
		},
	};
};

export const queries = () => {
	const query = request().query;

	return {
		get: (name: string): string | string[] | ParsedQs | ParsedQs[] | undefined => {
			return query[name];
		},
		has: (name: string): boolean => {
			return query[name] != null;
		},
		getAll: (): ParsedQs => {
			return query;
		},
		keys: (): string[] => {
			return Object.keys(query);
		},
	};
};

export const body = () => {
	const body = request().body;

	return {
		get: (name: string): any => {
			return body[name];
		},
		has: (name: string): boolean => {
			return body[name] != null;
		},
		getAll: (): { [key: string]: any } => {
			return body;
		},
		keys: (): string[] => {
			return Object.keys(body);
		},
	};
};

export const meta = (): unknown => {
	return request().meta;
};
