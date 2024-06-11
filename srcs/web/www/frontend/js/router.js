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

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCookie(name) {
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

async function showFriendList() {
	try {
		const user = await getRequest('https://127.0.0.1/api/user/user_login/');
		if (!user)
			return ;
		const id = await getRequest('https://127.0.0.1/api/user/user_details/', user['name']);
		const friend = await getRequest('https://127.0.0.1/api/user/user_relation/', id['id']);
		const userList = await getRequest('https://127.0.0.1/api/user/user_list/');
		const nbOfUsers = userList['length'];
		const nbOfFriend = friend['length'];

		let divFriend = document.getElementById('friendList');
		let divAddFriend = document.getElementById('addFriend');
		while (divFriend.hasChildNodes())
			divFriend.removeChild(divFriend.firstChild);
		while (divAddFriend.hasChildNodes())
			divAddFriend.removeChild(divAddFriend.firstChild);

		for (let i = 0; i < nbOfUsers; i++) {
			let button = document.createElement('button');
			let card = document.createElement('div');
			let cardBody = document.createElement('div');
			
			let img = document.createElement('img');
			let imgAdd = document.createElement('img');
			img.src = '/frontend/img/person-fill-dash.svg';
			imgAdd.src = '/frontend/img/person-fill-add.svg';
			
			let text = '';
			let friendName = '';
			let isFriend = false;
			if (userList[i]['id'] == id['id']) {
				continue ;
			}
			else if (nbOfFriend) {
				for (let j = 0; j < nbOfFriend; j++) {
					if (userList[i]['id'] == friend[j]['User1Id'] || userList[i]['id'] == friend[j]['User2Id']) {
						friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
						text = document.createTextNode(friendName['name']);
						isFriend = true;
						break ;
					}
				}
				if (isFriend === false) {
					friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
					text = document.createTextNode(friendName['name']);
				}
			}
			else {
				friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
				text = document.createTextNode(friendName['name']);
				isFriend = false;
			}
			button.classList.add('btn');
			cardBody.classList.add('card-body');
			cardBody.classList.add('d-flex');
			cardBody.classList.add('justify-content-between');
			card.classList.add('card');
			card.appendChild(cardBody);
			cardBody.appendChild(text);
			cardBody.appendChild(button);
			if (isFriend === true) {
				button.appendChild(img);
				divFriend.appendChild(card);
			}
			else if (isFriend === false) {
				button.addEventListener('click', () => addFriend(user['name'], userList[i]['name']));
				button.appendChild(imgAdd);
				divAddFriend.appendChild(card);
			}
		}
	}
	catch (error) {
		console.error(error);
	}
}

async function addFriend(userName, friendName) {
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
		// method: 'POST',
		// headers: {
		// 	'Authorization': `Bearer ${getCookie('jwt')}`,
		// 	'X-CSRFToken': `${getCookie('csrftoken')}`
		// },
		// body: formData
	// }
	// postRequest('https://127.0.0.1/api/match/match/', options);
	fetch('https://127.0.0.1/api/user/add_friend/' + userName + '/' + friendName + '/');
	showFriendList();
}

window.addEventListener('DOMContentLoaded', () => {
	let lang = localStorage.getItem("lang");
	handleRoutes();
	renderFooter();
	renderHeader();
	showFriendList();
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

async function postRequest(url, options = null) {
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
	try {
		const test = await fetch(url + options);
		if (!test.ok) {
			console.log(url);
			return [];
		}
		return await test.json();
	}
	catch (error) {
		return [];
	}
}