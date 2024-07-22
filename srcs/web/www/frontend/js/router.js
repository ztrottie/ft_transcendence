import { getRequest, loadContent, loadContentLang, postAuth, postRequest } from "./api/fetch.js";
import { renderHome } from "./pages/home/home.js";
import { renderLogin } from "./pages/login/login.js";
import { renderHeader } from "./components/header/header.js";
import { renderFooter } from "./components/footer/footer.js";
import { renderSignup } from "./pages/signUp/signup.js";

import { Game } from '../../Game/core/Game.js';

export function debounce(func, delay) {
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

export async function renderTemplate() {
	await loadContent('content', '/frontend/js/pages/template/template.html');
	changeLanguage(localStorage.getItem("lang"));

	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

	document.querySelectorAll('input[name="options"]').forEach((elem) => {
		elem.addEventListener('change', function() {
			const nbOfGame = document.getElementById('numberOfGame')
			if (elem.value != 'tournament') {
				document.getElementById('reverseMode').hidden = false;
				nbOfGame.max = 3;
			}
			else if (elem.value == 'tournament') {
				nbOfGame.max = nbOfGame.nextElementSibling.value = nbOfGame.value = 1;
				document.getElementById('reverse').checked = false;
				document.getElementById('reverseMode').hidden = true;
			}
		})
	})

	document.getElementById('gameBtn').addEventListener('click', (e) => {
		e.preventDefault();
		let formData = new FormData(document.getElementById('gameSet'));
		console.log("data");
		for(let pair of formData.entries()){
			console.log(pair[0], pair[1]);
		}

		if (formData.get('options') == 4)
			new bootstrap.Modal(document.getElementById('lobby1', {})).show();
		else if (formData.get('options') == 'tournament')
			new bootstrap.Modal(document.getElementById('lobbyTournament', {})).show();
		else
			new bootstrap.Modal(document.getElementById('lobby', {})).show();
	});
}

function renderNotFound() {
	loadContent('content', '/frontend/js/pages/error/pageNotFound.html');
}
const routeHandlers = {
	'': renderTemplate,
	'#/login': renderLogin,
	'#/signup': renderSignup,
	'default': renderNotFound
};

async function handleRoutes() {
	const hash = window.location.hash || '';
	const handler = routeHandlers[hash] || routeHandlers['default'];
	document.getElementById('content').innerHTML = '';
	handler();
	changeLanguage(localStorage.getItem("lang"));
}

window.addEventListener('DOMContentLoaded', () => {
	let lang = localStorage.getItem("lang");
	handleRoutes();
	renderFooter();
	renderHeader();
	// showFriendList();
	// loadContentLang('body', document.documentElement.lang, () => {
	// 	attachEventListeners();
	// });
	localStorage.setItem("lang", lang);
	if (localStorage.getItem("lang") != 'fr' && localStorage.getItem("lang") != 'en' && localStorage.getItem("lang") != 'ja') {
		if (navigator.language == 'fr' || navigator.language == 'en' || navigator.language == 'ja')
			localStorage.setItem("lang", navigator.language);
		else
			localStorage.setItem("lang", "en");
	}
	changeLanguage(localStorage.getItem("lang"));
	const game = new Game();
	game.start();
});

export function hideAndSeek(boolean) {
	document.getElementById('header').hidden = boolean;
	document.getElementById('content').hidden = boolean;
	document.getElementById('footer').hidden = boolean;
}

window.addEventListener('hashchange', () => {
	hideAndSeek(false);
	handleRoutes();
});


export function changeLanguage(lang) {
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
		}, { once: true });

		if (button.dataset.lang == document.documentElement.lang) {
			localStorage.setItem("lang", button.dataset.lang);
			button.disabled = true;
			button.classList.add("btn-primary");
		}
		else {
			button.disabled = false;
			button.classList.remove("btn-primary");
		}
	});
}



export async function showFriendList() {
	try {
		const userList = await getRequest('https://127.0.0.1/api/user/user_list/');
		const nbOfUsers = userList['length'];

		let divUser = document.getElementById('friendList');
		if (divUser.childElementCount === nbOfUsers)
			return ;
		while (divUser.hasChildNodes())
			divUser.removeChild(divUser.firstChild);

		for (let i = 0; i < nbOfUsers; i++) {
			let card = document.createElement('div');
			let cardBody = document.createElement('div');
			let friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
			let text = document.createTextNode(friendName['name']);
			cardBody.classList.add('card-body');
			cardBody.classList.add('d-flex');
			cardBody.classList.add('justify-content-between');
			card.classList.add('card');
			card.appendChild(cardBody);
			cardBody.appendChild(text);
			divUser.appendChild(card);
		}
	}
	catch (error) {
		console.error(error);
	}
}

// export async function showFriendList() {
// 	try {
// 		const user = await getRequest('https://127.0.0.1/api/user/user_login/');
// 		if (!user.name)
// 			return ;
// 		const id = await getRequest('https://127.0.0.1/api/user/user_details/', user['name']);
// 		const friend = await getRequest('https://127.0.0.1/api/user/user_relation/', id['id']);
// 		const userList = await getRequest('https://127.0.0.1/api/user/user_list/');
// 		const nbOfUsers = userList['length'];
// 		const nbOfFriend = friend['length'];

// 		let divFriend = document.getElementById('friendList');
// 		let divAddFriend = document.getElementById('addFriend');
// 		while (divFriend.hasChildNodes())
// 			divFriend.removeChild(divFriend.firstChild);
// 		while (divAddFriend.hasChildNodes())
// 			divAddFriend.removeChild(divAddFriend.firstChild);

// 		for (let i = 0; i < nbOfUsers; i++) {
// 			let button = document.createElement('button');
// 			let card = document.createElement('div');
// 			let cardBody = document.createElement('div');
			
// 			let img = document.createElement('img');
// 			let imgAdd = document.createElement('img');
// 			img.src = '/frontend/img/person-fill-dash.svg';
// 			imgAdd.src = '/frontend/img/person-fill-add.svg';
			
// 			let text = '';
// 			let friendName = '';
// 			let isFriend = false;
// 			if (userList[i]['id'] == id['id']) {
// 				continue ;
// 			}
// 			else if (nbOfFriend) {
// 				for (let j = 0; j < nbOfFriend; j++) {
// 					if (userList[i]['id'] == friend[j]['User1Id'] || userList[i]['id'] == friend[j]['User2Id']) {
// 						friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
// 						text = document.createTextNode(friendName['name']);
// 						isFriend = true;
// 						break ;
// 					}
// 				}
// 				if (isFriend === false) {
// 					friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
// 					text = document.createTextNode(friendName['name']);
// 				}
// 			}
// 			else {
// 				friendName = await getRequest('https://127.0.0.1/api/user/user_details/', userList[i]['id']);
// 				text = document.createTextNode(friendName['name']);
// 				isFriend = false;
// 			}
// 			button.classList.add('btn');
// 			cardBody.classList.add('card-body');
// 			cardBody.classList.add('d-flex');
// 			cardBody.classList.add('justify-content-between');
// 			card.classList.add('card');
// 			card.appendChild(cardBody);
// 			cardBody.appendChild(text);
// 			cardBody.appendChild(button);
// 			if (isFriend === true) {
// 				button.appendChild(img);
// 				divFriend.appendChild(card);
// 			}
// 			else if (isFriend === false) {
// 				button.addEventListener('click', () => addFriend(user['name'], userList[i]['name']));
// 				button.appendChild(imgAdd);
// 				divAddFriend.appendChild(card);
// 			}
// 		}
// 	}
// 	catch (error) {
// 		console.error(error);
// 	}
// }

// async function addFriend(userName, friendName) {
// 	fetch('https://127.0.0.1/api/user/add_friend/' + userName + '/' + friendName + '/');

// 	let divAddFriend = document.getElementById('addFriend');
// 	let i = 0;
// 	while (divAddFriend.children[i].children[0].childNodes[0].nodeValue != friendName)
// 		i++;
// 	if (divAddFriend.children[i].children[0].childNodes[0].nodeValue == friendName)
// 		divAddFriend.removeChild(divAddFriend.children[i]);

// 	let divFriend = document.getElementById('friendList');
// 	let button = document.createElement('button');
// 	let card = document.createElement('div');
// 	let cardBody = document.createElement('div');
// 	let img = document.createElement('img');
// 	img.src = '/frontend/img/person-fill-dash.svg';
// 	button.classList.add('btn');
// 	cardBody.classList.add('card-body');
// 	cardBody.classList.add('d-flex');
// 	cardBody.classList.add('justify-content-between');
// 	card.classList.add('card');
// 	card.appendChild(cardBody);
// 	cardBody.appendChild(document.createTextNode(friendName));
// 	cardBody.appendChild(button);
// 	button.appendChild(img);
// 	divFriend.appendChild(card);
// }