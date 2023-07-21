import { suits, numbers } from './suitsNumbers.js';
import { Card } from './Card.js';
import { Deck } from './Deck.js';


//Extends Deck, automatically populates deck with poker cards (also depends on options) + has discardPile property
export class PokerDeck extends Deck{

        //so they're accessed as part of PokerDeck
        static suits = suits;
        static numbers = numbers;

        /*
        Accepts numberOfDecks, the number of poker decks to put in this deck; defaults to 1.
        Accepts useJoker; if true, adds (2*numberOfDecks) jokers to the deck.
        */
        constructor(numberOfDecks=1, useJoker=false) {
            const cards = [];
            for (const x in suits) {
                for (const y in numbers) {
                    for (let i=0; i<numberOfDecks; i++){
                        cards.push(new Card(suits[x], numbers[y]));
                    }
                }
            }

            if (useJoker) {
                for (let i=0; i<numberOfDecks*2; i++) cards.push(new Card('Joker', 'Joker'));
            }

            super(cards);
            this._discardPile = new Deck();
        }


        //If deck is empty after draw, or its size is lower than count, add the discard pile back; then draw as usual.
        draw(count){
            if (this.remaining()-count <= 0 ) this.resetDiscardPile();
            return super.draw(count);
        }


        //returns discard pile
        getDiscardPile(){
            return this._discardPile._stack;
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