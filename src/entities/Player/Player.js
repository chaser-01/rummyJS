export class Player{
    constructor(game, id){
        if (game.type!=Game) {
        }
        this._game = game;
        this._id = id;
        this._hand = [];
        this._melds = [];
        this._playing = true;
    }

    resetCards() {this._hand = []; this._melds = [];}

    addToHand(cards) {this._hand.push(cards);}

    addMeld(meld) {this._melds.push(meld);}
}