export const loadContent = async (id, filePath) => {
	try {
		let file = await fetch(filePath);
		while (!file.ok)
			file = await fetch(filePath);
		const html = await file.text();
		let container = document.getElementById(id).innerHTML = html
	} catch (error) {
		console.error(`Error : ${filePath} -> `, error);
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
		if (translations[key]) {
			element.textContent = translations[key];
		}
	});
	document.documentElement.lang = lang;
};

