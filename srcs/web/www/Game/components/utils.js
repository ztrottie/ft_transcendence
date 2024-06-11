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
	game.paddle1.name = name1;
	game.paddle2.name = name2;
	game.paddle3.name = name3;
	game.paddle4.name = name4;
	game.idle = false;
}