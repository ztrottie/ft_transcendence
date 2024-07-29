import { loadContent, postAuth } from '../../api/fetch.js';
import { debounce, showFriendList, sleep } from '../../router.js';

export async function renderHeader() {
	try {
		await loadContent('header', '/frontend/js/components/header/header.html');
	} catch (error) {
		console.error('Error fetching header.html:', error);
	}
	document.querySelector('.logout_btn').addEventListener('click', async function(event) {
		try {
			const options = {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
				},
			}
			await postAuth('https://127.0.0.1/api/accounts/logout/', options)
			document.querySelector('.logout_btn').hidden = true
			document.querySelector('.login_btn').hidden = false
			sessionStorage.removeItem('access_token')
			showFriendList()
		} catch (error) {
			console.log('error')
		}
	})
}

