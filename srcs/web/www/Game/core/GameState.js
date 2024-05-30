export class GameState {
	constructor() {
		this.keysPressed = {};
		this.addEventListeners();
	}

	addEventListeners() {
		window.addEventListener('keydown', (event) => {
			this.keysPressed[event.key] = true;
		});

		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.key] = false;
		});
	}

	isKeyPressed(key) {
		return !!this.keysPressed[key];
	}

	update(game) {
		// Update paddles based on key presses
		if (this.isKeyPressed('w')) {
			game.paddle1.moveUp();
		}
		if (this.isKeyPressed('s')) {
			game.paddle1.moveDown();
		}
		if (this.isKeyPressed('ArrowUp')) {
			game.paddle2.moveUp();
		}
		if (this.isKeyPressed('ArrowDown')) {
			game.paddle2.moveDown();
		}
	}
}
