

class GameScore{

    /*
    Initialize _scores, with starting round, 1. 
    Here, each player starts with score 0 and playing true (ie, is currently playing the game).
    Initializes the current round as 1.
    */
    constructor(players){
        this._scores = {
            round: {
              1: players.reduce((acc, item) => {
                acc[item] = { score: 0, playing: true }; 
                return acc;
              }, {})
            }
          }
        
        this._round = 1;
    }

    //Adds a player that was not previously playing.
    addPlayer(player){
        this._scores.round[this._round][player].score = 0;
        this._scores.round[this._round][player].playing = true;
    }

    //Sets a player as not playing.
    setPlayerAsLeft(player){
        this._scores.round[this._round][player].playing = false;
    }

    //Sets a player as playing.
    setPlayerAsPlaying(player){
        this._scores.round[this._round][player].playing = true;
    }


    /*
    Called by Game object at the end of every round, to evaluate all player's scores.
    Calls evaluatePlayerScore on each player to evaluate their score, and update for the current _round.
    If player is not currently playing, their score is set as '-'.
    */
    evaluateRoundScore(){
        for (const player of this._scores.round[this._round]){
            if (player.playing === true){
                this._scores.round[this._round][player].score = evaluatePlayerScore(player);        
            }
            else{
                this._scores.round[this._round][player].score = '-';
            }
        }
    }


    /*
    Evaluates a single Player's score.
    This function should be overridden for different variations of the game.
    */
    evaluatePlayerScore(player){

    }


    /*
    Initializes the round object in _scores, for the next round.
    For each player, if currently playing, set playing as true and score as 0. Else, playing is false and score is '-'.
    Then, increments _round.
    */
    initializeNextRound(){
        for (const player of this._scores.round[this._round]){
            if (player.playing === true){
                this._scores.round[this._round+1][player].playing = true;
                this._scores.round[this._round+1][player].score = 0; 
            }
            else{
                this._scores.round[this._round+1][player].playing = false;
                this._scores.round[this._round+1][player].score = '-'; 
            }
        }
        this._round++;
    }
}

export { GameScore };