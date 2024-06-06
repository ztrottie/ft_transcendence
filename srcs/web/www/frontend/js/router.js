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
    // Split cookie string and get all individual name=value pairs in an array
    let cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}

async function renderTemplate() {
	loadContent('content', '/frontend/js/pages/template/template.html');
	await sleep(50);
	const gameButton = document.querySelectorAll('#gameBtn');
	gameButton.forEach(button => {
		button.addEventListener('click', () => {
			const jsonString = JSON.stringify({
				'guest1': "a",
				'guest2': "v",
				'guest3': "s",
				'winner': "s",
				'date': "2020-12-01",
				'tournement_id': 1,
				'user': 1
			});
		
			
			const formData = new FormData();
			formData.append('_content_type', 'application/json');
			formData.append('_content', jsonString);
			
			
			const options = {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${getCookie('csrftoken')}`
				},
				body: formData
			}
			postRequest('https://127.0.0.1/api/match/match/', options);
			// getRequest('https://127.0.0.1/api/user/user_list/');
		});
});
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

window.addEventListener('DOMContentLoaded', () => {
	let lang = localStorage.getItem("lang");
	handleRoutes();
	renderFooter();
	renderHeader();
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

function getRequest(url) {
	fetch(url)
		.then(response => {
			return response.json()
		})
		.then(data => {
			return console.log('Success:', data)
		})
		.catch(error => console.error('Error:', error));
}