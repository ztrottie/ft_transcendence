import { getInfo, getRequest, loadContentLang, postAuth } from "./api/fetch.js";
import { renderHeader } from "./components/header/header.js";
import { renderFooter } from "./components/footer/footer.js";
import { renderTemplate } from "./pages/template/template.js";
import { renderLogin } from "./pages/login/login.js";
import { renderSignup } from "./pages/signUp/signup.js";
import { renderHome } from "./pages/home/home.js";
import { renderNotFound } from "./pages/error/error.js";

import { Game } from '../../Game/core/Game.js';
import { currentLang } from "./api/fetch.js";

export const game = new Game();

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

const routeHandlers = {
	'': renderTemplate,
	'#/game': renderHome,
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

window.addEventListener('DOMContentLoaded', async () => {
	let lang = localStorage.getItem("lang");
	await handleRoutes();
	await renderFooter();
	await renderHeader();
	await showFriendList();
	localStorage.setItem("lang", lang);
	if (localStorage.getItem("lang") != 'fr' && localStorage.getItem("lang") != 'en' && localStorage.getItem("lang") != 'ja') {
		if (navigator.language == 'fr' || navigator.language == 'en' || navigator.language == 'ja')
			localStorage.setItem("lang", navigator.language);
		else
			localStorage.setItem("lang", "en");
	}
	changeLanguage(localStorage.getItem("lang"));
	game.start();
	await isLogin()
});

async function isLogin() {
	try {
		let file = await postAuth(location.origin + '/api/user/user_login/', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
			}
		});
		if (file.ok) {
			document.querySelector('.logout_btn').hidden = false
			document.querySelector('.login_btn').hidden = true
		}
	} catch(error) {
		console.log('allo')
	}
}

export function hideAndSeek(boolean) {
	document.getElementById('header').hidden = boolean;
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

		if (button.dataset.lang == currentLang) {
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
		const userList = await getRequest(location.origin + '/api/user/user_list/', {method: 'GET', headers: {'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`}});
		const nbOfUsers = userList['length'];
		let divUser = document.getElementById('friendList');
		if (divUser.childElementCount === nbOfUsers)
			return ;
		while (divUser.hasChildNodes())
			divUser.removeChild(divUser.firstChild);

		for (let i = 0; i < nbOfUsers; i++) {
			let card = document.createElement('div');
			let cardBody = document.createElement('div');
			let friendName = await getInfo(location.origin + '/api/user/user_details/', userList[i]['id']);
			if (!friendName.id) {
				while (divUser.hasChildNodes())
					divUser.removeChild(divUser.firstChild);
				return ;
			}
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