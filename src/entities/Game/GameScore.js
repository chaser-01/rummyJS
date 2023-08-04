export class GameScore{

    /*
    Initialize _scores, with starting round 1. 
    Here, each player starts with score 0.
    Initializes the current round as 1.
    */
    constructor(players){
        this.scores = {1: {}}
        for (const player of players) this.scores[1][player] = 0;
        this.currentRound = 1;
    }


    //Increments currentRound and initializes the next round in scores.
    initializeNextRound(players){
        for (const player of players) this.scores[this.currentRound][player] = 0;
        this.currentRound++;
    }


    /*
    Called by Game object at the end of every round, to evaluate all player's scores.
    Calls evaluatePlayerScore on each player to evaluate their score, and update for currentRound.
    */
    evaluateRoundScore(){
        for (const player of Object.keys(this.scores[this.currentRound])){
            this.scores[this.currentRound][player] = this.evaluatePlayerScore(player);
        }
    }


    /*
    Evaluates a single Player's score (total value of their hand).
    This function should be overridden for variations with different scoring systems.
    */
    evaluatePlayerScore(player){
        let score = 0;
        if (player.hand){
            score = player.hand.reduce((prevVal, card) => prevVal+card.cardNumberValue(), score);
        }
        return score;
    }
}
