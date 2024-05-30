import { loadContent } from '../../api/fetch.js';

export function renderFooter() {
	try {
		loadContent('footer', '/frontend/js/components/footer/footer.html');
	} catch (error) {
		console.error('Error fetching footer.html:', error);
	}
}


