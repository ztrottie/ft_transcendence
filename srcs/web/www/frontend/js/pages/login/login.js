import { loadContent } from '../../api/fetch.js';

export function renderLogin() {
	try {
		loadContent('content', 'https://127.0.0.1/api/accounts/login/');
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
}