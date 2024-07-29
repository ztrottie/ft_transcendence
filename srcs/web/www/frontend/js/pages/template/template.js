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

	document.getElementById('gameBtn').addEventListener('click', (e) => {
		e.preventDefault();
		let formData = new FormData(document.getElementById('gameSet'));
		console.log("data");
		for(let pair of formData.entries()){
			console.log(pair[0], pair[1]);
		}

		if (formData.get('options') === '4p')
			new bootstrap.Modal(document.getElementById('lobby1', {})).show();
		else if (formData.get('options') == 'tournament')
			new bootstrap.Modal(document.getElementById('lobbyTournament', {})).show();
		else
			new bootstrap.Modal(document.getElementById('lobby', {})).show();
	});
}