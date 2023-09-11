/**
 * @constant
 * An "enum" that represents statuses the game can take.
 * The game/player actions that can be taken at any point of time are determined by the current status.
 * It is assigned to the 'gameStatus' property in a Game.
 */
export enum GameStatus {
    PLAYER_TO_DRAW = 'PLAYER_TO_DRAW',
    PLAYER_TURN = 'PLAYER_TURN',
    ROUND_ENDED = 'ROUND_ENDED',
    END_GAME = 'END_GAME'
  };