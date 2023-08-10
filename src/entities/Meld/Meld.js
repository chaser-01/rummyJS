import {isMeld} from './isMeld.js';


/**
 * Represents a Rummy meld.
 * When created/modified, the meld is always (re)validated.
 */
export class Meld {
    /**
     * Creates a Meld.
     * @constructor
     * @param {Card[]} cards
     * @param {string} jokerNumber - optional joker number, so that it needn't be passed in again later on
     */
    constructor(cards, jokerNumber=0){
        if (isMeld(cards, jokerNumber)){
            this.cards = cards;
        }
        else{
            this.cards = [];
        }
        this.jokerNumber = jokerNumber;
    }

    
    /**
     * Validates the instance's validity as a meld.
     * @param {string} jokerNumber 
     * @returns {boolean}
     */
    isComplete(cards=this.cards, jokerNumber=this.jokerNumber){
        return isMeld(cards, jokerNumber);
    }


    /**
     * Verifies that a card can be added to the meld, and still form a valid meld.
     * @param {Card[]} newCard 
     * @param {string} jokerNumber 
     * @returns  {boolean}
     */
    addCard(newCard, jokerNumber=this.jokerNumber){
        let modifiedCards = [...this.cards].push(newCard);
        if (isMeld(modifiedCards), jokerNumber){
            this.cards.push(newCard);
            return true;
        }
        return false;
    }


    /**
     * Attempts to replace the specified card with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     * @param {Card[]} newCard 
     * @param {int} replacedIndex 
     * @param {string} jokerNumber 
     * @returns {Card|boolean}
     */
    replaceCard(newCard, replacedIndex, jokerNumber=this.jokerNumber){
        if (this.cards[replacedIndex].number != jokerNumber) return false;

        let modifiedCards = [...this.cards];
        modifiedCards.splice(replacedIndex, 1, newCard);
        if (isMeld(modifiedCards, jokerNumber)){
            let replacedCard = this.cards.splice(replacedIndex, 1, newCard);
            return replacedCard;
        }
        return false;
    }

    
    /**
     * Attempts to replace the first possible joker with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     * @param {*} newCard 
     * @param {*} jokerNumber 
     * @returns {Card|boolean}
     */
   replaceAnyJoker(newCard, jokerNumber=this.jokerNumber){
        for (let i=0; i<this.cards.length; i++){
            if (this.cards[i].number === jokerNumber){
                if (this.isComplete([...this.cards].splice(i, 1, newCard), jokerNumber)){
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
