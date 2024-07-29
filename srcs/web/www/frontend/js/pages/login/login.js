import { loadContent, postAuth } from '../../api/fetch.js';
import { showFriendList } from '../../router.js';

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
	
		if (isNaN(val) || val == " " || val == " ") {
			target.value = "";
			return;
		}
	
		if (val != "") {
			const next = target.nextElementSibling;
			if (next) {
				next.focus();
				next.select();
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
				prev.select();
			}
			return;
		}
	});
}

let loginForm = handleLogin;

async function listenerFunction(event) {
	event.preventDefault();
	loginForm(this);
}

async function handleLogin(data) {
	const formData = new FormData(data);

	const options = {
		method: 'POST',
		headers: {
			'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
		},
		body: formData
	}
	let file = await postAuth('https://127.0.0.1/api/accounts/login/', options);
	if (file.ok) {
		elementForm(true);
		loginForm = handleOTP;
	}
}

async function handleOTP(data) {
	const otpInput = document.querySelectorAll('.otp-field input');
	let otp = "";
	otpInput.forEach((input) => {
		otp += input.value;
	});

	const formData = new FormData(data);
	formData.append('otp', otp);
	// for (var pair of formData.entries()) {
	// 	console.log(pair[0]+ ', ' + pair[1]); 
	// }

	const options = {
		method: 'POST',
		headers: {
			'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
		},
		body: formData
	}
	let file = await postAuth('https://127.0.0.1/api/accounts/verify/', options);
	if (file.ok) {
		document.querySelector('.logout_btn').hidden = false;
		document.querySelector('.login_btn').hidden = true;
		let token = await file.json();
		sessionStorage.setItem('access_token', token['data']['access']);
		showFriendList();
		location.href = '#';
	}
}

export async function renderLogin() {
	try {
		let file = await postAuth('https://127.0.0.1/api/token/verify/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'token': `${sessionStorage.getItem('access_token')}`
			})
		});
		if (file.ok) {
			location.href = '#';
			return ;
		}
	} catch (error) {
	}
	try {
		await loadContent('content', '/api/accounts/login/');
	} catch (error) {
		console.error('Error fetching login.html:', error);
	}
	elementForm(false);
	document.getElementById('myForm').addEventListener('submit', listenerFunction);
}