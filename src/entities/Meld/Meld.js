import {Card} from '../PokerDeck/PokerDeck.js';
import {isMeld} from './isMeld.js';

export class Meld {
    constructor(cards, jokerNumber=0){
        if (this.isComplete(cards, jokerNumber)){
            this._cards = cards;
            this.jokerNumber = jokerNumber;
        }
    }

    //Getter for _cards.
    getCards(){
        return [...this._cards];
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
    Accepts a card newCard, returns true/false + modifies _cards.
    */
    addCard(newCard){
        if (isComplete([...this._cards, newCard], this.jokerNumber)){
            this._cards.push(newCard);
            return true;
        }
        return false;
    }


    /*
    Verifies that the card at replacedIndex can be replaced with newCard, and still form a valid meld.
    Useful for where the replacing card must be drag-dropped to the specific to-be-replaced card within a meld.
    Accepts a card newCard and to-be-replaced index replacedIndex, returns true/false + modifies _cards.
    */
    replaceCard(newCard, replacedIndex){
        if (this._cards[replacedIndex].number != jokerNumber) return false;
        if (isComplete([...this._cards].splice(replacedIndex, 1, newCard), jokerNumber)){
            this._cards.splice(replacedIndex, 1, newCard);
            return true;
        }
        return false;
    }

    /*
    Verifies that a joker (if any) can be replaced with newCard, and still form a valid meld.
    Useful for checking if any jokers in a meld can be replaced with newCard.
    Accepts a card newCard, returns true/false + modifies _cards.
    */
   replaceJoker(newCard){
        for (let i=0; i<this._cards.length; i++){
            if (this._cards[i].number === jokerNumber){
                if (isComplete([...this._cards].splice(i, 1, newCard), jokerNumber)){
                    this._cards.splice(i, 1, newCard);
                    return true;
                }
            }
        }
        return false;
   }
}
