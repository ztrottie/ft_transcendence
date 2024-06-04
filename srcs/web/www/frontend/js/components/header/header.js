import { loadContent } from '../../api/fetch.js';

export function renderHeader() {
	try {
		loadContent('header', '/frontend/js/components/header/header.html');
	} catch (error) {
		console.error('Error fetching header.html:', error);
	}
}

