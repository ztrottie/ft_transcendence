import { loadContent } from "../../api/fetch.js";

export function renderNotFound() {
	loadContent('content', '/frontend/js/pages/error/pageNotFound.html');
}