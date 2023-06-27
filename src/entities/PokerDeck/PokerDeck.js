import Deck from 'card-deck';
import {suits, numbers} from '../../constants/constants.js';

export class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
}


/*
Constructs a deck with all of the normal poker cards.
Accepts numberOfDecks, the number of poker decks to put in this deck; defaults to 1.
Accepts useJoker; if true, adds (2*numberOfDecks) jokers to the deck.
*/
export class PokerDeck extends Deck {
        
        constructor(numberOfDecks=1, useJoker=false) {
            const cards = [];
            for (const suit of Object.keys(suits)) {
                for (const number of Object.keys(numbers)) {
                    for (let i=0; i<decks; i++){
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


        //draws as per usual, but checks if the deck is empty afterwards; adds the discard pile back to deck if so.
        draw(count){
            super.draw(count);
            if (!this.remaining()) this.resetDiscardPile();
        }

        //add a card to the discard pile
        addToDiscardPile(card){
            this._discardPile.addToTop(card);
        }

        //draw *count* cards from the discard pile
        drawFromDiscardPile(count){
            this._discardPile.draw(count);
        }

        //puts discard pile back into the deck
        resetDiscardPile(){
            let allDiscardedCards = this._discardPile.draw(this._discardPile.remaining());
            this.addToTop(allDiscardedCards);
        }
    }