import AsyncLocalStorage from 'async_hooks';
import { OChildrenResponse } from '#framework/response';
import { OChildrenRequest } from '#framework/request';

export const asyncLocalStorage = new AsyncLocalStorage.AsyncLocalStorage<{
	request: OChildrenRequest;
	response: OChildrenResponse;
}>();

export const getStore = (): { request: OChildrenRequest; response: OChildrenResponse } => {
	const store = asyncLocalStorage.getStore();
	if (store == null) {
		throw new Error('Store is not defined');
	}
	return store;
};
