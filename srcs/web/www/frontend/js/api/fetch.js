export const loadContent = async (id, filePath, callback = null) => {
	try {
		let file = await fetch(filePath);
		for (let i = 10; !file.ok && i > 0; i--)
			file = await fetch(filePath);
		if (!file.ok) {
			file = await fetch(`/frontend/js/pages/error/pageNotFound.html`);
			const html = await file.text();
			document.getElementById(id).innerHTML = html
		}
		else {
			const html = await file.text();
			document.getElementById(id).innerHTML = html
			if (callback && typeof callback === 'function')
				callback();
		}
	} catch (error) {
		console.error(`Error : ${filePath} -> `, error);
	}
}

export async function postRequest(url, options = null) {
	fetch(url, options)
		.then(response => {
			return response.json()
		})
		.then(data => {
			return console.log('Success:', data)
		})
		.catch(error => console.error('Error:', error));
}

export function postAuth(url, options = null) {
	const response = fetch(url, options)
		.catch(error => console.error('Error:', error));
		return response
}

export async function getInfo(url, options = '') {
	try {
		const response = await fetch(url + options, {'credentials': 'include'});
		if (!response.ok) {
			console.log(url);
			return [];
		}
		return await response.json();
	}
	catch (error) {
		return [];
	}
}

export async function getRequest(url, options = null) {
	try {
		console.log(options)
		const response = await fetch(url, options);
		if (!response.ok) {
			console.log(url);
			return [];
		}
		return await response.json();
	}
	catch (error) {
		return [];
	}
}

const translationsCache = {};
let isLanguageChangePending = false;

export const loadContentLang = async (id, lang, callback) => {
	if (isLanguageChangePending) {
		return;
	}
	if (lang != 'en' && lang != 'fr' && lang != 'ja') {
		console.error(`Error loading content for language '${lang}'`)
		return;
	}
	isLanguageChangePending = true;
	try {
		if (translationsCache[lang]) {
			applyTranslations(id, translationsCache[lang], lang);
			if (callback && typeof callback === 'function') {
				callback();
			}
			return;
		}
		try {
			const response = await fetch(`/frontend/js/lang/${lang}.json`);
			if (!response.ok) {
				throw new Error(`Failed to load translation file for language '${lang}'.`);
			}
			const translations = await response.json();
			translationsCache[lang] = translations;
			applyTranslations(id, translations, lang);
			if (callback && typeof callback === 'function') {
				callback();
			}
		} catch (error) {
			throw error;
		}
	} catch (error) {
		console.error(`Error loading content for language '${lang}': `, error);
	} finally {
		isLanguageChangePending = false;
	}
};

const applyTranslations = (id, translations, lang) => {
	const container = document.getElementById(id);
	if (!container) {
		console.error(`Container element with ID '${id}' not found.`);
		return;
	}
	const elements = container.querySelectorAll('[data-i18n]');
	elements.forEach(element => {
		const key = element.dataset.i18n;
		if (key.startsWith('[placeholder]')) {
			const placeholderKey = key.replace('[placeholder]', '');
			if (translations[placeholderKey])
				element.placeholder = translations[placeholderKey];
		}
		else if (key.startsWith('[data-bs-title]')) {
			const titleKey = key.replace('[data-bs-title]', '');
			if (translations[titleKey])
				element.setAttribute('data-bs-original-title', translations[titleKey]);
		}
		else if (translations[key]) {
			element.textContent = translations[key];
		}
	});
	document.documentElement.lang = lang;
};

