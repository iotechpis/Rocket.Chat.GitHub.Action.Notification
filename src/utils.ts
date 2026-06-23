import axios from 'axios';

const jobStatuses: string[] = ['success', 'failure', 'cancelled'];
const metionConditions: string[] = [...jobStatuses, 'always'];

function isValid(target: string, validList: string[]): boolean {
	return validList.includes(target);
}

/**
 * Check if status entered by user is allowed by GitHub Actions.
 * @param {string} jobStatus
 * @returns {string|Error}
 */
export function validateStatus(jobStatus: string): string {
	if (!isValid(jobStatus, jobStatuses)) {
		throw new Error('Invalid type parameter');
	}
	return jobStatus;
}

export function isValidCondition(condition: string): boolean {
	return isValid(condition, metionConditions);
}

export function formatResponseBody(data: unknown): string {
	if (data === undefined || data === null) {
		return '';
	}
	if (typeof data === 'string') {
		return data;
	}
	try {
		return JSON.stringify(data, null, 2);
	} catch {
		return String(data);
	}
}

export function formatError(err: unknown): string {
	if (axios.isAxiosError(err)) {
		const parts: string[] = [];
		const status = err.response?.status;
		const body = formatResponseBody(err.response?.data);

		if (status) {
			parts.push(`Request failed with status code ${status}`);
		} else if (err.message) {
			parts.push(err.message);
		}

		if (body) {
			parts.push(body);
		}

		return parts.join('\n');
	}

	return err instanceof Error ? err.message : String(err);
}
