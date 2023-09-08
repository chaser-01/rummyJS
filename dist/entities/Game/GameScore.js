/**
 * Used for tracking and calculating a game's score.
 * Scores are evaluated only at the end of every round.
 * Scores are evaluated for all players in `this.game.players`, even if they have (just) quit.
*/
export class GameScore {
    /// Methods ///
    /**
     * Creates a GameScore. Initializes scores to -1.
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.scores = {};
    }
    /**
     * Evaluates the current round's score.
     * Calls evaluatePlayerScore for each (currently playing) player.
     */
    evaluateRoundScore() {
        for (const player of this.game.players) {
            let score = this.evaluatePlayerScore(player);
            this.scores[this.game.currentRound].push([player, score]);
        }
    }
    /**
     * Evaluates a single player's score.
     * Variants with different scoring systems should override this.
     */
    evaluatePlayerScore(player) {
        let score = 0;
        if (player.hand) {
            score = player.hand.reduce((prevVal, card) => prevVal + card.cardNumberValue(), score);
        }
        return score;
    }
}
