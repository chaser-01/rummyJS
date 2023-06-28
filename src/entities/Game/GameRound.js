export class GameRound{
    constructor(game){
        //TO DO: type check that game is of Game type; if not, throw error
        this._game = game;
        this.playerMoves = [];
    }

    //TO DO: determine some sort of split between round and turn functions (ask chatgpt about this i guess)

    /*
    
    */
    startRound(){
        this._game._deck.shuffle();
        for (const player of this._game._players){
            player._hand = this._game._deck.draw(this._game._cardsToDraw);
        }

    }
}