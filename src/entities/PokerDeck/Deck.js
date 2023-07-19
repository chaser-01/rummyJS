//Code mostly adopted from card-deck package but modified a bit
export class Deck{
    constructor(cards=[]){
        if (!Array.isArray(cards)) this._stack = [];
        this._stack = cards;
        return this;
    }

    //returns deck size
    remaining(){
        return this._stack.length;
    }

    //Fisher–Yates implementation adapted from http://bost.ocks.org/mike/shuffle/
    shuffle() {
        var remaining = this._stack.length;
        var tmp;
        var idx;
      
        // While there remain elements to shuffle…
        while ( remaining ) {
          // Pick a remaining element...
          idx = Math.floor( Math.random() * remaining-- );
      
          // And swap it with the current element.
          tmp = this._stack[ remaining ];
          this._stack[ remaining ] = this._stack[ idx ];
          this._stack[ idx ] = tmp;
        }
      }
    
    //draws *count* cards and removes them from deck.
    draw(count){
        let drawnCards = this._stack.splice(0, count);
        return drawnCards;
    }

    //add cards array to top of the deck
    addToTop(cards){
        this._stack = this._stack.concat(cards);
    }
}