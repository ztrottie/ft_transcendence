import { loadContent, loadContentLang } from "./api/fetch.js";
import { renderHome } from "./pages/home/home.js";
import { renderLogin } from "./pages/login/login.js";
import { renderHeader } from "./components/header/header.js";
import { renderFooter } from "./components/footer/footer.js";

function debounce(func, delay) {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

async function renderTemplate() {
	loadContent('content', '/frontend/js/pages/template/template.html');
	await sleep(1000);
	const gameButton = document.querySelectorAll('#gameBtn');
	gameButton.forEach(button => {
		button.addEventListener('click', async () => {
			// const jsonString = JSON.stringify({
			// 	'guest1': "a",
			// 	'guest2': "v",
			// 	'guest3': "s",
			// 	'winner': "s",
			// 	'date': "2020-12-01",
			// 	'tournement_id': 1,
			// 	'user': 1
			// });
			
			
			// const formData = new FormData();
			// formData.append('_content_type', 'application/json');
			// formData.append('_content', jsonString);
			
			// const options = {
			// 	method: 'POST',
			// 	headers: {
			// 		'Authorization': `Bearer ${getCookie('jwt')}`,
			// 		'X-CSRFToken': `${getCookie('csrftoken')}`
			// 	},
			// 	body: formData
			// }
			// postRequest('https://127.0.0.1/api/match/match/', options);
			let test = await getRequest('https://127.0.0.1/api/user/user_list/');
			console.log(test);
		});
	});
	changeLanguage(localStorage.getItem("lang"));
}

function renderNotFound() {
	loadContent('content', '/frontend/js/pages/error/pageNotFound.html');
}
const routeHandlers = {
	'': renderTemplate,
	'#/': renderHome,
	'#/login': renderLogin,
	'default': renderNotFound
};

function handleRoutes() {
	const hash = window.location.hash || '';
	const handler = routeHandlers[hash] || routeHandlers['default'];
	document.getElementById('content').innerHTML = '';
	handler();
	changeLanguage(localStorage.getItem("lang"));
}

async function showFriend() {
	let user = await getRequest('https://127.0.0.1/api/user/user_login/');
	console.log('User', user);
	let id = await getRequest('https://127.0.0.1/api/user/user_details/', user['name']);
	console.log('User Id', id);
	let friend = await getRequest('https://127.0.0.1/api/user/user_relation/', id['id']);
	console.log('Friends list', friend);
	let nbOfFriend = friend['length'];
	console.log('Number of friends:', nbOfFriend);
	let divFriend = document.getElementById('friendList');
	let p = document.createElement('p');
	for (let i = 0; i < nbOfFriend; i++) { //create row with [name			button remove friend]
		let text = '';
		let friendName = '';
		if (friend[i]['User2Id'] != id['id']) {
			friendName = await getRequest('https://127.0.0.1/api/user/user_details/', friend[i]['User2Id']);
			text = document.createTextNode(friendName['name']);
			console.log('friend: ', friend[i]['User2Id']);
		}
		else {
			friendName = await getRequest('https://127.0.0.1/api/user/user_details/', friend[i]['User1Id']);
			text = document.createTextNode(friendName['name']);
			console.log('friend: ', friend[i]['User1Id']);
		}
		p.appendChild(text);
		divFriend.appendChild(p);
	}

}

window.addEventListener('DOMContentLoaded', () => {
	let lang = localStorage.getItem("lang");
	handleRoutes();
	renderFooter();
	renderHeader();
	showFriend();

	loadContentLang('body', document.documentElement.lang, () => {
		attachEventListeners();
	});
	localStorage.setItem("lang", lang);
	if (localStorage.getItem("lang") != 'fr' && localStorage.getItem("lang") != 'en' && localStorage.getItem("lang") != 'ja') {
		if (navigator.language == 'fr' || navigator.language == 'en' || navigator.language == 'ja')
			localStorage.setItem("lang", navigator.language);
		else
			localStorage.setItem("lang", "en");
	}
	changeLanguage(localStorage.getItem("lang"));
});

window.addEventListener('hashchange', handleRoutes);

function changeLanguage(lang) {
	debouncedChangeLanguage(lang);
}

const debouncedChangeLanguage = debounce((lang) => {
	loadContentLang('body', lang, () => {
		attachEventListeners();
	});
}, 300);

function attachEventListeners() {
	const langButtons = document.querySelectorAll('.lang-btn');
	langButtons.forEach(button => {
		button.addEventListener('click', () => {
			changeLanguage(button.dataset.lang);
		});

		if (button.dataset.lang == document.documentElement.lang) {
			localStorage.setItem("lang", button.dataset.lang);
			button.disabled = true;
			button.classList.add("btn-primary");
		}
		else {
			button.disabled = false;
			button.classList.remove("btn-primary")
		}
	});
}

async function postRequest(url, options) {
	// const lifeElement = document.getElementById("numberOfLife");
	// const gameElement = document.getElementById("numberOfGame");
	// const life = lifeElement.value;
	// const game = gameElement.value;

	fetch(url, options)
		.then(response => {
			return response.json()
		})
		.then(data => {
			return console.log('Success:', data)
		})
		.catch(error => console.error('Error:', error));
	
}

async function getRequest(url, options = '') {
	const test = await fetch(url + options);
	return await test.json();
}