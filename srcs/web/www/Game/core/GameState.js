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
		this.state = {
			idle: true,
			pause: false,
			normal1v1: false,
			normal4player: false,
			inverse1v1: false,
			inverse4player: false,
			tournaments: false,
			winner: false,
		};
	}

	// state: idle, pause, normal1v1, normal4player, inverse1v1, inverse4player, tournois, winner
	// Set the current state
	setState(newState, game) {
		
		if (newState != 'idle' && this.state.idle){
			this.state.idle = false;
			game.setIdle();
		}
		// Reset all states
		for (let state in this.state) {
			this.state[state] = false;
		}

		switch (newState) {
			case 'idle':
				this.state.idle = true;
				game.setIdle();
				break;
			case 'pause':
				this.state.pause = true;
				break;
			case 'normal1v1':
				this.state.normal1v1 = true;
				break;
			case 'normal4player':
				this.state.normal4player = true;
				break;
			case 'inverse1v1':
				this.state.inverse1v1 = true;
				break;
			case 'inverse4player':
				this.state.inverse4player = true;
				break;
			case 'tournaments':
				this.state.tournaments = true;
				break;
			case 'winner':
				this.state.winner = true;
				break;
			default:
				console.error('Etat inconnu:', newState);
				break;
		}
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
			
			if (this.state.idle){
				this.setState('pause', game);
			}else{
				this.setState('idle', game);
			}



			this.keysHandled['KeyR'] = true; // Mark the key as handled
		}
		
		// Update paddles based on key
		if (this.state.idle == false){
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