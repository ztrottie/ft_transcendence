import { getRequest, loadContent, postAuth } from '../../api/fetch.js';
import { showFriendList, sleep } from '../../router.js';

export async function renderLogin() {
    try {
        await loadContent('content', '/api/accounts/login/');
    } catch (error) {
        console.error('Error fetching login.html:', error);
    }
    document.getElementById('myForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        const options = {
            method: 'POST',
            headers: {
				'X-CSRFToken': document.getElementById('csrfmiddlewaretoken')
            },
            body: formData
        }
        await postAuth('https://127.0.0.1/api/accounts/login/', options)

        // await sleep(100);
        // showFriendList();
        location.href = '#';
		
    }, {once: true});
}



// const jsonString = JSON.stringify({
		// 	'csrfmiddlewaretoken': document.getElementById('csrftoken').children[0].value,
		// 	'email': "w@w.com",
		// 	'password': "w"
		// });

	// console.log(formData.values())
		// for (var pair of formData.entries()) {
		// 	console.log(pair[0]+ ', ' + pair[1]); 
		// }

		// console.log(jsonString)

		// let input = document.getElementById('csrfmiddlewaretoken');
	// input.setAttribute('value', getCookie('csrftoken'));