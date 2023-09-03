import {validateAndSortMeld} from './validateAndSortMeld';
import { Card } from '../PokerDeck/Card';
import { numbers } from '../PokerDeck/suitsNumbers';

/** Represents a Rummy meld. */
export class Meld {
    /// Properties ///

    /** The meld cards. */
    _cards: Card[];
    /** The optional joker number; if present, must be a key in `numbers`. If none, it is false. */
    jokerNumber: keyof typeof numbers|false;
    /** The maximum size for a set. Rules dictate that this is by default 4. */
    maxSetSize: number;


    /// Methods ///


    /** Creates a Meld. */
    constructor(cards: Card[], jokerNumber: (keyof typeof numbers|false)=false, maxSetSize=4){
        if (validateAndSortMeld(cards, jokerNumber, maxSetSize)){
            this._cards = cards;
        }
        else{
            this._cards = [];
        }
        this.jokerNumber = jokerNumber;
        this.maxSetSize = maxSetSize;
    }

    
    /** The meld's cards. */
    get cards() {return this._cards;}

    
    /**
     * Validates an array of cards and sorts them if they form a valid meld.
     * If no cards are passed in, operates on the instance's cards.
     */
    checkAndSortMeld(
        cards: Card[] = this._cards, 
        jokerNumber: (keyof typeof numbers|false) = this.jokerNumber, 
        maxSetSize: number = this.maxSetSize){
        return validateAndSortMeld(cards, jokerNumber, maxSetSize);
    }


    /** Verifies that a card can be added to the meld, and still form a valid meld. */
    addCard(newCard: Card){
        let modifiedCards = [...this._cards].concat(newCard);
        if (this.checkAndSortMeld(modifiedCards)){
            this._cards = this._cards.concat(newCard);
            return true;
        }
        return false;
    }


    /**
     * Attempts to replace the specified card with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
    replaceCard(newCard: Card, replacedIndex: number): Card|false{
        if (this._cards[replacedIndex].number != this.jokerNumber) return false;

        let modifiedCards = [...this._cards];
        modifiedCards.splice(replacedIndex, 1, newCard);

        if (this.checkAndSortMeld(modifiedCards, this.jokerNumber, this.maxSetSize)){
            let replacedCard = this._cards.splice(replacedIndex, 1, newCard)[0];
            return replacedCard;
        }
        return false;
    }

    
    /**
     * Attempts to replace the first possible joker with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
   replaceAnyJoker(newCard: Card): Card|false{
        for (let i=0; i<this._cards.length; i++){
            if (this._cards[i].number == this.jokerNumber){
                if (this.checkAndSortMeld([...this._cards].splice(i, 1, newCard), this.jokerNumber, this.maxSetSize)){
                    let replacedCard = this._cards.splice(i, 1, newCard)[0];
                    return replacedCard;
                }
            }
        }
        return false;
   }

   
   /**
    * A string representation for the meld.
    * @override
    */
   toString(): string{
        return `${this._cards.map(card =>`${card}`)}`
   }
}
