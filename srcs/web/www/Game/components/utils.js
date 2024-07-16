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

export function setProperties(game, life, round, gameMode){
	game.lifeNumber = life;
	game.roundNumber = round;
	game.gameMode = gameMode;
}

export function setPlayerName(game, name1, name2, name3, name4){
	game.paddles[0].name = name1;
	game.paddles[1].name = name2;
	game.paddles[2].name = name3;
	game.paddles[3].name = name4;
}