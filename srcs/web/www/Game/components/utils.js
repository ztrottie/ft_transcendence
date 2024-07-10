export function createTimer(delay) {
	let lastTime = 0;
	return function () {
		const currentTime = performance.now();
		if (currentTime - lastTime >= delay) {
			lastTime = currentTime;
			return true;
		}
		return false;
	};
}

export function startGame(game, life, round, name1, name2, name3, name4){
	game.lifeNumber = life;
	game.roundNumber = round;
	game.paddles[0].name = name1;
	game.paddles[1].name = name2;
	game.paddles[2].name = name3;
	game.paddles[3].name = name4;
	game.manager.state.idle = false;
}