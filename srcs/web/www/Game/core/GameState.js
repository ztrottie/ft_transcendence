export class GameState {
	constructor() {
		this.keysPressed = {};
		this.keysHandled = {};
		this.addEventListeners();
		this.win_score = {
			player1: 0,
			player2: 0,
			player3: 0,
			player4: 0
		};
	}

	addEventListeners() {
		window.addEventListener('keydown', (event) => {
			if (!this.keysPressed[event.code]) {
				this.keysPressed[event.code] = true;
				this.keysHandled[event.code] = false;
			}
		});

		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.code] = false;
		});
	}

	isKeyPressed(code) {
		return !!this.keysPressed[code];
	}

	update(game) {
		if (this.isKeyPressed('KeyR') && !this.keysHandled['KeyR']) {
			game.setIdle(!game.idle);
			this.keysHandled['KeyR'] = true; // Mark the key as handled
		}
		
		// Update paddles based on key
		if (game.idle == false){
			if (game.playerNumber >= 2){

				//player 1
				if (this.isKeyPressed('KeyW')) {
					game.paddles[0].move("up");
				}
				if (this.isKeyPressed('KeyS')) {
					game.paddles[0].move("down");
				}
				
				//player 2
				if (this.isKeyPressed('ArrowUp')) {
					game.paddles[1].move("up");
				}
				if (this.isKeyPressed('ArrowDown')) {
					game.paddles[1].move("down");
				}
			}
			if (game.playerNumber == 4){

				//player 3
				if (this.isKeyPressed('KeyO')) {
					game.paddles[2].move("left");
				}
				if (this.isKeyPressed('KeyP')) {
					game.paddles[2].move("right");
				}
					
				//player 4
				if (this.isKeyPressed('KeyX')) {
					game.paddles[3].move("left");
				}
				if (this.isKeyPressed('KeyC')) {
					game.paddles[3].move("right");
				}
			}
		}
	}
}