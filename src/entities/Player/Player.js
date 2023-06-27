export class Player{
    constructor(id){
        this._id = id;
        this._hand = [];
        this._melds = [];
    }

    getId() {return this._id;}
    getHand() {return this._hand;}
    getMelds() {return this._melds;}

    setHand(hand) {this._hand = hand;}
    addMeld(meld) {this._melds.push(meld);}
    
    resetCards() {this._hand = []; this._melds = [];}
}