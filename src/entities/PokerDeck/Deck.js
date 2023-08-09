/**
 * Represents a generic deck (literally an array with some generic functionality).
 */
export class Deck{
    /**
     * Creates a Deck.
     * @param {[*]} cards 
     * @returns 
     */
    constructor(cards=[]){
        if (!Array.isArray(cards)) this._stack = [];
        else this._stack = cards;
        return this;
    }

    /**
     * Returns the cards.
     * @returns {[*]}
     */
    getCards(){
        return this._stack;
    }

    /**
     * Returns the deck size.
     * @returns {int}
     */
    remaining(){
        return this._stack.length;
    }

    /**
     * Shuffles the deck (Fisher–Yates implementation adapted from http://bost.ocks.org/mike/shuffle/)
     * @modifies {_stack}
     */
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
    
    
    /**
     * Draws specified amount of cards from top of the deck.
     * @param {int} count 
     * @returns {[*]}
     */
    draw(count){
        if (!count) return false;
        let drawnCards = this._stack.splice(this._stack.length-count, count);
        return drawnCards;
    }

    /**
     * Adds cards to the top of the deck.
     * @param {[*]} cards 
     * @returns 
     */
    addToTop(cards){
        if (!Array.isArray(cards)) return;
        this._stack.push(...cards); 
    }
}