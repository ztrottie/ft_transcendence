import { loadContent, postAuth } from '../../api/fetch.js';
import { showFriendList, sleep } from '../../router.js';

function elementForm(otp) {
	document.querySelectorAll('.formStart').forEach((elem) => {
		elem.hidden = otp;
	})
	document.querySelectorAll('.otp-input').forEach((elem) => {
		elem.hidden = !otp;
		if (otp == true) {
			elem.required = true;
		}
	})
	const otpId = document.getElementById("otp-field");
	
	otpId.addEventListener("input", function (e) {
		const target = e.target;
		const val = target.value;
	
		if (isNaN(val)) {
			target.value = "";
			return;
		}
	
		if (val != "") {
			const next = target.nextElementSibling;
			if (next) {
				next.focus();
			}
		}
	});
	
	otpId.addEventListener("keyup", function (e) {
		const target = e.target;
		const key = e.key.toLowerCase();
	
		if (key == "backspace" || key == "delete") {
			target.value = "";
			const prev = target.previousElementSibling;
			if (prev) {
				prev.focus();
			}
			return;
		}
	});
}

export async function renderLogin() {
	try {
		await loadContent('content', '/api/accounts/login/');
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
	elementForm(false);
	document.getElementById('myForm').addEventListener('submit', async function(event) {
		event.preventDefault();

		const formData = new FormData(this);
		
		const options = {
			method: 'POST',
			headers: {
				'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
			},
			body: formData
		}
		let file = await postAuth('https://127.0.0.1/api/accounts/login/', options)
		if (file.ok) {
			elementForm(true);
			document.getElementById('myForm').addEventListener('submit', async function(event) {
				event.preventDefault();
				const otpInput = document.querySelectorAll('.otp-field input');
				let otp = "";
				otpInput.forEach((input) => {
					otp += input.value;
				});

				const formData = new FormData(this);
				formData.append('otp', otp);
				for (var pair of formData.entries()) {
					console.log(pair[0]+ ', ' + pair[1]); 
				}

				const options = {
					method: 'POST',
					headers: {
						'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
					},
					body: formData
				}
				let file = await postAuth('https://127.0.0.1/api/accounts/verify/', options)
				if (file.ok) {
					document.querySelector('.logout_btn').hidden = false
					document.querySelector('.login_btn').hidden = true
					let test = await file.json()
					sessionStorage.setItem('access_token', test['data']['access'])
					showFriendList()
					location.href = '#';
				}
			});
		}
		// await sleep(100);
		// showFriendList();
	}, { once: true});
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