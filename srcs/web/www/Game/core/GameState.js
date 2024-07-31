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
			normal4p: false,
			reverse1v1: false,
			reverse4p: false,
			tournament: false,
			winner: false,
			current: 'idle',
			last: null
		};
	}

	// state: idle, pause, normal1v1, normal4p, reverse1v1, reverse4p, tournois, winner
	// Set the current state
	setState(newState, game) {
		
		this.last = this.state.current;
		this.current = newState;
		if (newState != 'idle' && this.state.idle){
			game.setIdle();
		}

		switch (newState) {
			case 'idle':
				this.resetState();
				this.state.idle = true;
				game.setIdle();
				break;
			case 'pause':
				this.state.pause = !this.state.pause;
				break;
			case 'normal1v1':
				this.resetState();
				this.state.normal1v1 = true;
				game.playerNumber = 2;
				game.ballMaxSpeed = 0.1;
				break;
			case 'normal4p':
				this.resetState();
				this.state.normal4p = true;
				game.playerNumber = 4;
				game.ballMaxSpeed = 0.1;
				break;
			case 'reverse1v1':
				this.resetState();
				this.state.reverse1v1 = true;
				game.playerNumber = 2;
				game.reverse = true;
				game.ballMaxSpeed = 0.2;
				break;
			case 'reverse4p':
				this.resetState();
				this.state.reverse4p = true;
				game.playerNumber = 4;
				game.reverse = true;
				game.ballMaxSpeed = 0.2;
				break;
			case 'tournament':
				this.resetState();
				this.state.tournament = true;
				break;
			case 'winner':
				this.state.winner = true;
				game.playerNumber = 0
				game.ball.removeFromScene(game.scene);
				const winner = "player1";
				const t = new Text(game.scene, game.board.center, winner);
				break;
			default:
				console.error('Etat inconnu:', newState);
				break;
		}
		game.setupPaddles();
		game.setupBall();
	}

	resetState() {
		this.state = {
			idle: false,
			pause: false,
			normal1v1: false,
			normal4player: false,
			reverse1v1: false,
			reverse4player: false,
			tournament: false,
			winner: false,
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
		if (this.isKeyPressed('Space') && !this.keysHandled['Space']) {
			
			if (this.state.idle){
				this.setState(game.gameMode, game);
			}else{
				game.resetRound();
			}
			this.keysHandled['Space'] = true; // Mark the key as handled
			console.log('Pressed Space');
		}

		if (this.isKeyPressed('KeyP') && !this.keysHandled['KeyP']) {
			this.setState('pause', game);
			this.keysHandled['KeyP'] = true; // Mark the key as handled
			console.log('Pressed P pause:', this.state.pause);
		}

		if (this.isKeyPressed('KeyR') && !this.keysHandled['KeyR']) {
			window.location.reload();
			this.keysHandled['KeyR'] = true; // Mark the key as handled
			console.log('Pressed R (reset)');
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