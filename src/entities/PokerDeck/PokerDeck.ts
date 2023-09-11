import { suits, numbers } from './suitsNumbers';
import { Card } from './Card';
import { Deck } from './Deck';



/**
 * Represents a poker deck.
 * Automatically populates the deck with poker cards, and has additional discardPile property of type Deck.
 */
export class PokerDeck extends Deck<Card>{
    /// Properties /// 


    /** Access suits enum through the class. */
    suits = suits;
    static suits = suits;

    /** Access suits enum through the class. */
    numbers = numbers;
    static numbers = numbers;

    /** The deck's discard pile. */
    private _discardPile: Deck<Card>;


    /// Methods ///
    

    /** Creates a PokerDeck by iterating over all possible suits and numbers. */
    constructor(numberOfDecks=1, useJoker=false) {
        const cards: Card[] = [];

        //get keys for suits and numbers
        //Note: have to do this filter cuz TS enums are kinda funky lol
        let suitsKeys = Object.keys(suits).filter(key => isNaN(Number(key))) as (keyof typeof suits)[];
        let numbersKeys = Object.keys(numbers).filter(key => isNaN(Number(key))) as (keyof typeof numbers)[];
        
        //iterate over all suits and numbers
        for (let i=0; i<numberOfDecks; i++){
            for (let x = 1; x<suitsKeys.length; x++) {
                for (let y = 1; y<numbersKeys.length; y++) {
                    cards.push(new Card(suitsKeys[x], numbersKeys[y]));
                }
            }
            if (useJoker) cards.push(new Card('Joker', 'Joker'));
        }

        

        super(cards);
        this._discardPile = new Deck();
    }


    /** Draws cards from the deck. Automatically shuffles the discard pile back into deck, if the deck is too small. */
    draw(count: number){
        if (this.remaining()-count <= 0 ) this.resetDiscardPile();
        return super.draw(count);
    }


    /** Returns copy of the deck. */
    getDiscardPile(): Card[]{
        return [...this._discardPile.getCards()];
    }
   

    /** Returns the deck size. */
    getDiscardPileSize(): number{
        return this._discardPile.remaining();
    }


    //Returns top card of the discard pile.
    getTopOfDiscardPile(): Card{
        return this._discardPile.getCards()[this.getDiscardPileSize()-1];
    }


    /** Adds a card to the top of the discard pile. */
    addToDiscardPile(card: Card){
        this._discardPile.addToTop([card]);
    }


    /** Draws from the discard pile. */
    drawFromDiscardPile(count: number){
        return this._discardPile.draw(count);
    }


    /** Puts the discard pile back onto the top of the deck. */
    resetDiscardPile(){
        let allDiscardedCards = this.drawFromDiscardPile(this.getDiscardPileSize());
        this.addToTop(allDiscardedCards);
    }


    /** Used as a callback fn for sorting cards... really its just the Card compare fn. */
    compareCards(a: Card, b: Card){
        return Card.compareCardsSuitFirst(a, b);
    }
}