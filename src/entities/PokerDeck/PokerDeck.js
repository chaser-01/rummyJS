import {suits, numbers} from '../../constants/constants.js';


//Represents a singular card.
export class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
}


//Code mostly adopted from card-deck package but modified a bit
class Deck{
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


//Extends Deck, automatically populates deck with poker cards (also depends on options) + has discardPile property
export class PokerDeck extends Deck{

        /*
        Accepts numberOfDecks, the number of poker decks to put in this deck; defaults to 1.
        Accepts useJoker; if true, adds (2*numberOfDecks) jokers to the deck.
        */
        constructor(numberOfDecks=1, useJoker=false) {
            const cards = [];
            for (const suit of Object.keys(suits)) {
                for (const number of Object.keys(numbers)) {
                    for (let i=0; i<numberOfDecks; i++){
                        cards.push(new Card(suit, number));
                    }
                }
            }

            if (useJoker) {
                for (i=0; i<numberOfDecks*2; i++) cards.push(new Card('Joker', 'Joker'));
            }

            super(cards);
            this._discardPile = new Deck();
        }

        //if deck will be empty after draw, or has less cards than can be drawn, add the discard pile back.
        //Then draw as usual.
        draw(count){
            if (this.remaining()-count <= 0 ) this.resetDiscardPile();
            return super.draw(count);
            
        }

        //add a card to the discard pile
        addToDiscardPile(card){
            this._discardPile.addToTop(card);
        }

        //draw *count* cards from the discard pile
        drawFromDiscardPile(count){
            return this._discardPile.draw(count);
        }

        //puts discard pile back into the deck
        resetDiscardPile(){
            let allDiscardedCards = this.drawFromDiscardPile(this._discardPile.remaining());
            this.addToTop(allDiscardedCards);
        }
    }