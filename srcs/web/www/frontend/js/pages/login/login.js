import { loadContent, postAuth } from '../../api/fetch.js';
import { getCookie, showFriendList, sleep } from '../../router.js';

export async function renderLogin() {
	document.getElementById('header').hidden = false;
	try {
		loadContent('content', '/frontend/js/pages/login/login.html', function () {loadContent('csrftoken', '/api/accounts/login/')});
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
	try {
		await sleep(1000)
		document.getElementById('myForm').addEventListener('submit', async function(event) {
			event.preventDefault();
			
			const formData = new FormData(this);
			
			const options = {
				method: 'POST',
				headers: {
					'X-CSRFToken': csrftoken
				},
				body: formData
			}
			const test = await postAuth('https://127.0.0.1/api/accounts/login/', options);
			console.log(test)
			
			await sleep(100);
			showFriendList();
			location.href = '#';
		});
	} catch (error) {

	}
}



// const jsonString = JSON.stringify({
		// 	'csrfmiddlewaretoken': document.getElementById('csrftoken').children[0].value,
		// 	'email': "w@w.com",
		// 	'password': "w"
		// });

	// console.log(formData.values())
		// for (var pair of formData.entries()) {
		// 	console.log(pair[0]+ ', ' + pair[1]); 
		// }

		// console.log(jsonString)

		// let input = document.getElementById('csrfmiddlewaretoken');
	// input.setAttribute('value', getCookie('csrftoken'));