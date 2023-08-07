/**
 * Used for tracking and calculating a game's score.
 */
export class GameScore{

    /**
     * Creates a GameScore. 
     * @constructor
     * @modifies {game} - Assigns the game to be tracked
     * @modifies {scores} - The object that tracks scores
     * @param {Game} game 
     */
    constructor(game){
        this.game = game;
        this.scores = {1: {}}
        for (const player of game.players) this.scores[1][player] = 0;
    }


    /**
     * If the game's current round doesn't exist in scores, initialize it
     * @modifies {scores}
     */
    initializeRound(){
        if (!scores[game.currentRound]){
            for (const player of game.players) {
                if (player.playing) this.scores[game.currentRound][player] = 0;
            }
        }
        this.currentRound++;
    }


    /**
     * Evaluates the current round's score for each playing player.
     * Calls evaluatePlayerScore for each (currently playing) player.
     * @modifies {scores}
     */
    evaluateRoundScore(){
        for (const player of Object.keys(this.scores[game.currentRound])){
            this.scores[game.currentRound][player] = this.evaluatePlayerScore(player);
        }
    }


    /**
     * Evaluates a single player's score.
     * Variants with different scoring systems should override this.
     * @param {Player} player 
     * @returns {int}
     */
    evaluatePlayerScore(player){
        let score = 0;
        if (player.hand){
            score = player.hand.reduce((prevVal, card) => prevVal+card.cardNumberValue(), score);
        }
        return score;
    }
}
