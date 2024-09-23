import { setPlayerName, setProperties } from "../../../../Game/components/utils.js";
import { loadContent } from "../../api/fetch.js";
import { changeLanguage, game } from "../../router.js";

function validateName(name) {
	if (name == '' || name == ' ' || name == ' ')
		return false;
	if (name[0] == ' ' || name[0] == ' ')
		return false;
	if (name[name.length - 1] == ' ' || name[name.length - 1] == ' ')
		return false;
	return true;
}

function checkForDuplicates(array) {
	return new Set(array).size !== array.length;
}

function checkLength(array) {
	for (let i = 0; i < array.length; i++)
		if (array[i].length > 10)
			return false;
	return true;
}

export async function renderTemplate() {
	await loadContent('content', '/frontend/js/pages/template/template.html');
	changeLanguage(localStorage.getItem("lang"));

	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

	document.querySelectorAll('input[name="options"]').forEach((elem) => {
		elem.addEventListener('change', function() {
			const nbOfGame = document.getElementById('numberOfGame');
			if (elem.value != 'tournament') {
				document.getElementById('reverseMode').hidden = false;
				nbOfGame.max = 3;
			}
			else if (elem.value == 'tournament') {
				nbOfGame.max = nbOfGame.nextElementSibling.value = nbOfGame.value = 1;
				document.getElementById('reverse').checked = false;
				document.getElementById('reverseMode').hidden = true;
			}
		});
	});

	document.querySelectorAll('#chooseName').forEach((elem) => {
		elem.addEventListener('input', function() {
			let count = 0;
			const arrayName = [];
			elem.querySelectorAll('input[name="name"]').forEach((el) => {
				if (validateName(el.value) === true) {
					arrayName[count] = el.value;
					count++;
				}
			});
			if (!checkLength(arrayName)) {
				elem.querySelector('#btnStart').hidden = true;
				elem.querySelector('h3[data-i18n="choose_spot"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_name"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_length"]').hidden = false;
			}
			else if (checkForDuplicates(arrayName)) {
				elem.querySelector('#btnStart').hidden = true;
				elem.querySelector('h3[data-i18n="choose_spot"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_name"]').hidden = false;
				elem.querySelector('h3[data-i18n="error_length"]').hidden = true;
			}
			else if (count === elem.length - 1) {
				elem.querySelector('#btnStart').hidden = false;
				elem.querySelector('h3[data-i18n="choose_spot"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_name"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_length"]').hidden = true;
			}
			else {
				elem.querySelector('#btnStart').hidden = true;
				elem.querySelector('h3[data-i18n="choose_spot"]').hidden = false;
				elem.querySelector('h3[data-i18n="error_name"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_length"]').hidden = true;
			}
		});

		elem.addEventListener('submit', function(e) {
			e.preventDefault();
			const formData = new FormData(this);
			
			const arrayName = [];
			let i = 0;

			for (var pair of formData.entries()) {
				if (validateName(pair[1]))
					arrayName[i] = pair[1];
				else
					arrayName[i] = '12345678910';
				i++;
			}

			if (checkForDuplicates(arrayName) || !checkLength(arrayName)) {
				elem.querySelector('#btnStart').hidden = true;
				elem.querySelector('h3[data-i18n="choose_spot"]').hidden = false;
				elem.querySelector('h3[data-i18n="error_name"]').hidden = true;
				elem.querySelector('h3[data-i18n="error_length"]').hidden = true;
			}
			else {
				setPlayerName(game, arrayName);
				game.manager.setState(game.gameMode, game);
				location.href = '#/game';
			}
		});
	});

	document.getElementById('gameSet').addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = new FormData(this);

		let nbPlayer = formData.get('options');
		let nbLife = formData.get('numberOfLife');
		let nbRound = formData.get('numberOfGame');

		if (nbPlayer === '4p') {
			new bootstrap.Modal(document.getElementById('lobby1', {})).show();
			nbPlayer = '4p';
		}
		else if (nbPlayer === 'tournament') {
			new bootstrap.Modal(document.getElementById('lobbyTournament', {})).show();
			nbPlayer = 'tournament';
		}
		else {
			new bootstrap.Modal(document.getElementById('lobby', {})).show();
			nbPlayer = '1v1';
		}

		if (nbRound < 1)
			nbRound = 1;
		else if (nbRound > 3)
			nbRound = 3;

		if (nbLife < 1)
			nbLife = 1;
		else if (nbLife > 5)
			nbLife = 5;

		if (nbPlayer === 'tournament')
			nbRound = 1;
		else if (formData.get('reverse') === 'on')
			nbPlayer = 'reverse' + nbPlayer;
		else
			nbPlayer = 'normal' + nbPlayer;
		setProperties(game, nbLife, nbRound, nbPlayer)

		// console.log('numberOfLife', nbLife);
		// console.log('numberOfGame', nbRound);
		// console.log('options', nbPlayer);
	});
}