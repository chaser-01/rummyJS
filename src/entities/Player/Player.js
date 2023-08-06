export class Player{
    constructor(game, id){
        this.game = game;
        this.id = id;
        this.hand = [];
        this.melds = [];
        this.playing = true;
    }

    addToHand(cards) {this.hand = this.hand.concat(cards);}
    addMeld(meld) {this.melds.push(meld);}
    resetCards() {this.hand = []; this.melds = [];}
}