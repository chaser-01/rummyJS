export class Player{
    constructor(game, id){
        this._game = game;
        this._id = id;
        this._hand = [];
        this._melds = [];
        this._playing = true;
    }

    addToHand(cards) {this._hand = this._hand.concat(cards);}
    addMeld(meld) {this._melds.push(meld);}
    resetCards() {this._hand = []; this._melds = [];}
}