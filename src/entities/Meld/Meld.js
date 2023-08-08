import {isMeld} from './isMeld.js';


/**
 * Represents a Rummy meld.
 * Just an array of cards, but holds some useful functionality + stores joker number for doing so (if applicable)
 */
export class Meld {
    /**
     * Creates a Meld; verifies that the cards form a valid meld first.
     * @constructor
     * @param {*} cards
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
     * Verifies the instance's validity as a meld.
     * @param {string} jokerNumber 
     * @returns {boolean}
     */
    isComplete(jokerNumber=this.jokerNumber){
        return isMeld(this.cards, jokerNumber);
    }


    /**
     * Verifies that a card can be added to the meld, and still form a valid meld.
     * @param {*} newCard 
     * @param {*} jokerNumber 
     * @returns  {boolean}
     */
    addCard(newCard, jokerNumber=this.jokerNumber){
        if (isComplete([...this.cards, newCard], jokerNumber)){
            this.cards.push(newCard);
            return true;
        }
        return false;
    }


    /**
     * Verifies that a card in the meld can be replaced, and still form a valid meld.
     * Only jokers should be replaceable... but not too sure.
     * Use this for manually picking the card to be replaced.
     * @param {*} newCard 
     * @param {*} replacedIndex 
     * @param {*} jokerNumber 
     * @returns {boolean}
     */
    replaceCard(newCard, replacedIndex, jokerNumber=this.jokerNumber){
        if (this.cards[replacedIndex].number != jokerNumber) return false;
        if (isComplete([...this.cards].splice(replacedIndex, 1, newCard), jokerNumber)){
            this.cards.splice(replacedIndex, 1, newCard);
            return true;
        }
        return false;
    }

    
    /**
     * Verifies that any joker in the meld can be replaced, and still form a valid meld.
     * 
     * @param {*} newCard 
     * @param {*} jokerNumber 
     * @returns {boolean}
     */
   replaceAnyJoker(newCard, jokerNumber=this.jokerNumber){
        for (let i=0; i<this.cards.length; i++){
            if (this.cards[i].number === jokerNumber){
                if (isComplete([...this.cards].splice(i, 1, newCard), jokerNumber)){
                    this.cards.splice(i, 1, newCard);
                    return true;
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
        let meldStr = '';
        this.cards.forEach(card => meldStr + `${card} `)
   }
}
