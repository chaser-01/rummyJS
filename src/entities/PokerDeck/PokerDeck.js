import { suits, numbers } from './suitsNumbers.js';
import { Card } from './Card.js';
import { Deck } from './Deck.js';



/**
 * Represents a poker deck.
 * Automatically populates the deck with poker cards, and has additional discardPile property of type Deck.
 * @extends Deck
 */
export class PokerDeck extends Deck{
    /**
     * Allows for access to suits object, using the class.
     * @constant
     */
    suits = suits;

    /**
     * Allows for access to numbers object, using the class.
     * @constant
     */
    numbers = numbers;

    
    /**
     * Creates a PokerDeck.
     * @constructor
     * @param {int} numberOfDecks - Number of full poker decks to populate the deck with
     * @param {boolean} useJoker - Whether to add 'numberOfDecks' * printed jokers to the deck
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

    /**
     * Draws cards from the deck. 
     * Automatically shuffles the discard pile back into deck, if the deck is too small.
     * @modifies {_stack}
     * @modifies {_discardPile}
     * @param {int} count 
     * @returns {Card[]}
     */
    draw(count){
        if (this.remaining()-count <= 0 ) this.resetDiscardPile();
        return super.draw(count);
    }

    /**
     * Returns the deck.
     * @returns {Card[]}
     */
    getDiscardPile(){
        return this._discardPile._stack;
    }
   
    /**
     * Returns the deck size.
     * @returns {int}
     */
    getDiscardPileSize(){
        return this._discardPile.remaining();
    }

    /**
     * Returns the top card of the discard pile.
     * @modifies {_discardPile}
     * @returns {Card}
     */
    getTopOfDiscardPile(){
        return this._discardPile._stack[this.getDiscardPileSize()-1];
    }

    /**
     * Adds a card to the top of the discard pile.
     * @modifies {_discardPile}
     * @param {Card} card 
     */
    addToDiscardPile(card){
        this._discardPile.addToTop(card);
    }

    /**
     * Draws from the discard pile.
     * @modifies {_discardPile}
     * @param {int} count 
     * @returns {Card[]}
     */
    drawFromDiscardPile(count){
        return this._discardPile.draw(count);
    }

    /**
     * Puts the discard pile back onto the top of the deck.
     * @modifies {_discardPile}
     * @modifies {_stack}
     */
    resetDiscardPile(){
        let allDiscardedCards = this.drawFromDiscardPile(this._discardPile.remaining());
        this.addToTop(allDiscardedCards);
    }
}