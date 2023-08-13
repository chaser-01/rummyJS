/**
 * @constant
 * An "enum" that represents statuses the game can take.
 * The game/player actions that can be taken at any point of time are determined by the current status.
 * It is assigned to the 'gameStatus' property in a Game.
 */
export const gameStatusEnum = Object.freeze({
    PLAYER_TO_DRAW: Symbol('PLAYER_TO_DRAW'),
    PLAYER_TURN: Symbol('PLAYER_TURN'),
    PLAYER_TURN_ENDED: Symbol('PLAYER_TURN_ENDED'),
    ROUND_ENDED: Symbol('ROUND_ENDED'),
    END_GAME: Symbol('END_GAME')
  });
