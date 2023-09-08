import { Game } from "../Game/Game";
import { Player } from "../Player/Player";
/**
 * Used for tracking and calculating a game's score.
 * Scores are evaluated only at the end of every round.
 * Scores are evaluated for all players in `this.game.players`, even if they have (just) quit.
*/
export declare class GameScore {
    /** The Game that is being tracked. */
    game: Game;
    /** The scores. Each round holds an array of (player, score) tuples. */
    scores: {
        [round: number]: [Player, number][];
    };
    /**
     * Creates a GameScore. Initializes scores to -1.
     * @constructor
     */
    constructor(game: Game);
    /**
     * Evaluates the current round's score.
     * Calls evaluatePlayerScore for each (currently playing) player.
     */
    evaluateRoundScore(): void;
    /**
     * Evaluates a single player's score.
     * Variants with different scoring systems should override this.
     */
    evaluatePlayerScore(player: Player): number;
}
