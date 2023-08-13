import {validateAndSortMeld} from './validateAndSortMeld.js';


/**
 * Represents a Rummy meld.
 * When created/modified, the meld is always (re)validated.
 */
export class Meld {
    /**
     * Creates a Meld.
     * @constructor
     * @param {Card[]} cards
     * @param {string} jokerNumber - optional joker number, which can replace any card in a meld
     * @param {int} maxSetSize - optional max size of a set; defaults to 4 as per common rules
     */
    constructor(cards, jokerNumber=0, maxSetSize=4){
        if (validateAndSortMeld(cards, jokerNumber, maxSetSize)){
            this.cards = cards;
        }
        else{
            this.cards = [];
        }
        this.jokerNumber = jokerNumber;
        this.maxSetSize = maxSetSize;
    }

    
    /**
     * Validates an array of cards and sorts them if they form a valid meld.
     * If no cards are passed in, operates on the instance's cards.
     * @param {Card[]} cards
     * @param {string} jokerNumber 
     * @param {int} maxSetSize
     * @returns {boolean}
     */
    checkAndSortMeld(cards=this.cards, jokerNumber=this.jokerNumber, maxSetSize=this.maxSetSize){
        return validateAndSortMeld(cards, jokerNumber, maxSetSize);
    }


    /**
     * Verifies that a card can be added to the meld, and still form a valid meld.
     * @param {Card[]} newCard 
     * @param {string} jokerNumber 
     * @returns {boolean}
     */
    addCard(newCard){
        let modifiedCards = [...this.cards].concat(newCard);
        if (this.checkAndSortMeld(modifiedCards)){
            this.cards = this.cards.concat(newCard);
            return true;
        }
        return false;
    }


    /**
     * Attempts to replace the specified card with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     * @param {Card[]} newCard 
     * @param {int} replacedIndex 
     * @returns {Card|boolean}
     */
    replaceCard(newCard, replacedIndex){
        if (this.cards[replacedIndex].number != this.jokerNumber) return false;

        let modifiedCards = [...this.cards];
        modifiedCards.splice(replacedIndex, 1, newCard);

        if (this.checkAndSortMeld(modifiedCards, this.jokerNumber, this.maxSetSize)){
            let replacedCard = this.cards.splice(replacedIndex, 1, newCard);
            return replacedCard;
        }
        return false;
    }

    
    /**
     * Attempts to replace the first possible joker with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     * @param {*} newCard 
     * @returns {Card|boolean}
     */
   replaceAnyJoker(newCard){
        for (let i=0; i<this.cards.length; i++){
            if (this.cards[i].number == jokerNumber){
                if (this.checkAndSortMeld([...this.cards].splice(i, 1, newCard), this.jokerNumber, this.maxSetSize)){
                    let replacedCard = this.cards.splice(i, 1, newCard);
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
   toString(){
        return `${this.cards.map(card =>`${card}`)}`
   }
}
