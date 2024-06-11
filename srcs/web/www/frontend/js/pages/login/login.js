import { loadContent } from '../../api/fetch.js';
import { getCookie, sleep } from '../../router.js';

export async function renderLogin() {
	try {
		loadContent('content', '/frontend/js/pages/login/login.html');
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
	await sleep(1000);
	let input = document.getElementById('csrfmiddlewaretoken');
	input.setAttribute('value', getCookie('csrftoken'));
}