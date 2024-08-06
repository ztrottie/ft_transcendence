import { loadContent, postAuth, translationsCache } from '../../api/fetch.js';

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
	document.getElementById('myForm').addEventListener('submit', async function(event) {
		let registerBtn = document.getElementById('registerBtn');
		registerBtn.removeAttribute('data-bs-dismiss');
		registerBtn.removeAttribute('data-bs-target');
		event.preventDefault();

		const formData = new FormData(this);

		const options = {
			method: 'POST',
			headers: {
				'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
			},
			body: formData
		}
		let file = await postAuth('https://127.0.0.1/api/accounts/signup/', options);
		if (file.ok)
			location.href = '#/login';
		else {
			const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
			const appendAlert = (message, type) => {
				const wrapper = document.createElement('div')
				wrapper.innerHTML = [
					`<div id="my-alert" class="alert alert-${type}" role="alert">`,
					`	<p data-i18n="error_register" class="text-center m-0">${message}</p>`,
					'</div>'
				].join('')

				alertPlaceholder.append(wrapper)
			}
			appendAlert(translationsCache[document.documentElement.lang]['error_register'], 'danger')
			registerBtn.setAttribute('data-bs-dismiss', 'alert');
			registerBtn.setAttribute('data-bs-target', '#my-alert');
		}
	});
}