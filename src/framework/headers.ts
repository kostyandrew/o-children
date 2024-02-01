import { Request, Response } from 'express';

import { CookieOptions } from 'express';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

// Assuming these are wrapper functions that return Express request and response objects
declare function request(): Request;
declare function response(): Response;

export const headers = () => {
	return {
		request: {
			get: (name: string): string | undefined => {
				return request().headers[name.toLowerCase()] as string | undefined;
			},
			getAll: (): IncomingHttpHeaders => {
				return request().headers;
			},
			has: (name: string): boolean => {
				return request().headers[name.toLowerCase()] !== undefined;
			},
			keys: (): string[] => {
				return Object.keys(request().headers);
			},
		},
		response: {
			get: (name: string): number | string | string[] | undefined => {
				return response().getHeader(name);
			},
			getAll: (): OutgoingHttpHeaders => {
				return response().getHeaders();
			},
			has: (name: string): boolean => {
				return response().hasHeader(name);
			},
			keys: (): string[] => {
				return response().getHeaderNames();
			},
			set: (name: string, value: string | number | string[]): void => {
				response().setHeader(name, value);
			},
			delete: (name: string): void => {
				response().removeHeader(name);
			},
		},
	};
};

export const cookies = () => {
	return {
		request: {
			get: (name: string): string | undefined => {
				return request().cookies[name];
			},
			getAll: (): { [key: string]: string } => {
				return request().cookies;
			},
			has: (name: string): boolean => {
				return request().cookies[name] != null;
			},
			keys: (): string[] => {
				return Object.keys(request().cookies);
			},
		},
		response: {
			set: (name: string, value: string, options: CookieOptions): void => {
				response().cookie(name, value, options);
			},
			delete: (name: string, options?: CookieOptions): void => {
				response().clearCookie(name, options);
			},
		},
	};
};
