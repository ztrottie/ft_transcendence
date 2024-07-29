import { loadContent, postAuth } from '../../api/fetch.js';
import { sleep } from '../../router.js';

export async function renderSignup() {
	try {
		let file = await postAuth('https://127.0.0.1/api/token/verify/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'token': `${sessionStorage.getItem('access_token')}`
			})
		})
		if (file.ok) {
			location.href = '#';
			return ;
		}
	} catch (error) {
	}
	try {
		await loadContent('content', '/api/accounts/signup/');
	} catch (error) {
		console.error('Error fetching signup.html:', error);
	}
	document.getElementById('myForm').addEventListener('submit', function(event) {
		event.preventDefault();

		const formData = new FormData(this);

		const options = {
			method: 'POST',
			headers: {
				'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
			},
			body: formData
		}
		postAuth('https://127.0.0.1/api/accounts/signup/', options);
		location.href = '#/login'
	});
}