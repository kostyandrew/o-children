import { getStore } from '#internal/requestResponseStore';
import { Response } from 'express';

export type OChildrenResponse = Response;

export const response = (): OChildrenResponse => {
	const { response } = getStore();
	return response;
};

export const json = (data: object): OChildrenResponse => {
	return response().json(data);
};

export const send = (data: string | number): OChildrenResponse => {
	return response().send(data);
};

export const status = (code: number): OChildrenResponse => {
	return response().status(code);
};

export const redirect = (url: string): OChildrenResponse => {
	return response().location(url);
};
