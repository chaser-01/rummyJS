import {isMeld} from './isMeld.js';

export class Meld {
    constructor(cards, jokerNumber=0){
        if (this.isComplete(cards, jokerNumber)){
            this.cards = cards;
        }
        else{
            this.cards = [];
        }
    }

    /*
    Verifies a meld with isMeld, in-class.
    Accepts an array of cards and an optional jokerNumber; returns true/false.
    */
    isComplete(cards, jokerNumber=0){
        return isMeld(cards, jokerNumber);
    }

    /*
    Verifies that newCard can be added and still form a valid meld.
    Accepts a card newCard, returns true/false + modifies cards.
    */
    addCard(newCard, jokerNumber=0){
        if (isComplete([...this.cards, newCard], jokerNumber)){
            this.cards.push(newCard);
            return true;
        }
        return false;
    }

    /*
    Verifies that the card at replacedIndex can be replaced with newCard, and still form a valid meld.
    Useful for where the replacing card must be drag-dropped to the specific to-be-replaced card within a meld.
    Accepts a card newCard and to-be-replaced index replacedIndex, returns true/false + modifies cards.
    */
    replaceCard(newCard, replacedIndex, jokerNumber=0){
        if (this.cards[replacedIndex].number != jokerNumber) return false;
        if (isComplete([...this.cards].splice(replacedIndex, 1, newCard), jokerNumber)){
            this.cards.splice(replacedIndex, 1, newCard);
            return true;
        }
        return false;
    }

    /*
    Verifies that any joker (if any exist) can be replaced with newCard, and still form a valid meld.
    Useful for checking if any jokers in a meld can be replaced with newCard.
    Accepts a card newCard, returns true/false + modifies cards.
    */
   replaceAnyJoker(newCard){
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
}
