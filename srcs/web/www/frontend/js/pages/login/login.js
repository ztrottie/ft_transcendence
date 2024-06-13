import { loadContent } from '../../api/fetch.js';
import { getCookie, sleep } from '../../router.js';

export async function renderLogin() {
	try {
		loadContent('content', '/frontend/js/pages/login/login.html');
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
	loadContent('csrftoken', '/api/accounts/login/');
	await sleep(1000);
	console.log(document.getElementById('csrftoken').children[0].value);
	// let input = document.getElementById('csrfmiddlewaretoken');
	// input.setAttribute('value', getCookie('csrftoken'));
}