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
		if (this.isKeyPressed('r')) {
			game.setIdle(!game.idle);
		}
		// Update paddles based on key
		if (game.idle == false){
			if (game.playerNumber >= 2){

				//player 1
				if (this.isKeyPressed('w')) {
					game.paddle1.move("up");
				}
				if (this.isKeyPressed('s')) {
					game.paddle1.move("down");
				}
				
				//player 2
				if (this.isKeyPressed('ArrowUp')) {
					game.paddle2.move("up");
				}
				if (this.isKeyPressed('ArrowDown')) {
					game.paddle2.move("down");
				}
			}
			if (game.playerNumber == 4){

				//player 3
				if (this.isKeyPressed('o')) {
					game.paddle3.move("left");
				}
				if (this.isKeyPressed('p')) {
					game.paddle3.move("right");
				}
					
				//player 4
				if (this.isKeyPressed('x')) {
					game.paddle4.move("left");
				}
				if (this.isKeyPressed('c')) {
					game.paddle4.move("right");
				}
			}
		}
	}
}
