import { loadContent } from '../../api/fetch.js';

export async function renderFooter() {
	try {
		await loadContent('footer', '/frontend/js/components/footer/footer.html');
	} catch (error) {
		console.error('Error fetching footer.html:', error);
	}
}