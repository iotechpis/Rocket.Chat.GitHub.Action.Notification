import axios from 'axios';

import {formatError, formatResponseBody} from '../src/utils';

describe('formatResponseBody', () => {
	it('formats objects as JSON', () => {
		expect(formatResponseBody({success: false, error: 'Invalid channel'})).toBe(JSON.stringify({success: false, error: 'Invalid channel'}, null, 2));
	});

	it('returns strings as-is', () => {
		expect(formatResponseBody('channel not found')).toBe('channel not found');
	});

	it('returns empty string for nullish values', () => {
		expect(formatResponseBody(null)).toBe('');
		expect(formatResponseBody(undefined)).toBe('');
	});
});

describe('formatError', () => {
	it('includes axios response body in the error message', () => {
		const error = new axios.AxiosError('Request failed with status code 400', axios.AxiosError.ERR_BAD_REQUEST, undefined, undefined, {
			status: 400,
			statusText: 'Bad Request',
			headers: {},
			config: {headers: new axios.AxiosHeaders()},
			data: {success: false, error: 'Invalid channel'}
		});

		expect(formatError(error)).toBe(`Request failed with status code 400\n${JSON.stringify({success: false, error: 'Invalid channel'}, null, 2)}`);
	});

	it('formats regular errors', () => {
		expect(formatError(new Error('something went wrong'))).toBe('something went wrong');
	});
});
