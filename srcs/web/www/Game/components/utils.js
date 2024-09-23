export function setProperties(game, life, round, gameMode){
	game.lifeNumber = life;
	game.roundNumber = round;
	game.gameMode = gameMode;
}

export function setPlayerName(game, name1, name2, name3, name4){
	game.playerName[0].name = name1;
	game.playerName[1].name = name2;
	game.playerName[2].name = name3;
	game.playerName[3].name = name4;
}