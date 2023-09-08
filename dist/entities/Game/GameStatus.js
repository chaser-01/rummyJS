/**
 * @constant
 * An "enum" that represents statuses the game can take.
 * The game/player actions that can be taken at any point of time are determined by the current status.
 * It is assigned to the 'gameStatus' property in a Game.
 */
export var GameStatus;
(function (GameStatus) {
    GameStatus["PLAYER_TO_DRAW"] = "PLAYER_TO_DRAW";
    GameStatus["PLAYER_TURN"] = "PLAYER_TURN";
    GameStatus["PLAYER_TURN_ENDED"] = "PLAYER_TURN_ENDED";
    GameStatus["ROUND_ENDED"] = "ROUND_ENDED";
    GameStatus["END_GAME"] = "END_GAME";
})(GameStatus || (GameStatus = {}));
;
