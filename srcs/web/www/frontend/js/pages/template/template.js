import { loadContent } from "../../api/fetch.js";
import { changeLanguage } from "../../router.js";

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
		//function(nbPlayer, nbLife, nbRound)

		console.log('numberOfLife', nbLife);
		console.log('numberOfGame', nbRound);
		console.log('options', nbPlayer);
	});
}