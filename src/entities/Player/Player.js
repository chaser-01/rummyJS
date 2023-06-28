export class Player{
    constructor(game, id){
        if (game.type!=Game) {
            //TODO: ^^ type check for a Game before instantiating; if not Game, throw error
        }
        this._game = game;
        this._id = id;
        this._hand = [];
        this._melds = [];
    }

    resetCards() {this.#hand = []; this.#melds = [];}
}