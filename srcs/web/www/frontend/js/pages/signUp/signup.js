import { loadContent, postAuth } from '../../api/fetch.js';
import { sleep } from '../../router.js';

export async function renderSignup() {
	try {
		loadContent('content', '/frontend/js/pages/signup/signup.html');
	} catch (error) {
		console.error('Error fetching signup.html:', error);
	}
	loadContent('csrftoken', '/api/accounts/signup/');
	await sleep(1000);
	document.getElementById('myForm').addEventListener('submit', function(event) {
		event.preventDefault();

		const formData = new FormData(this);

		const options = {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrftoken
			},
			body: formData
		}
		postAuth('https://127.0.0.1/api/accounts/signup/', options);
		location.href = '#/login'
	});
}