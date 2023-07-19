/*
"enum" that represents game statuses, used for tracking what game actions should occur next:
    -PLAYER_TO_DRAW: Player must draw from deck/discard pile
    -PLAYER_TURN: Player must take some player turn action(s)
    -PLAYER_TURN_ENDED: Game must go to next player
    -ROUND_ENDED: Game must start next round
    -END_GAME: Game has ended
*/
export const GameStatus = Object.freeze({
    PLAYER_TO_DRAW: Symbol('PLAYER_TO_DRAW'),
    PLAYER_TURN: Symbol('PLAYER_TURN'),
    PLAYER_TURN_ENDED: Symbol('PLAYER_TURN_ENDED'),
    ROUND_ENDED: Symbol('ROUND_ENDED'),
    END_GAME: Symbol('END_GAME')
  });