import { suitNumberValue, suitsText } from './suitsNumbers.js';

//Represents a singular card.
export class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }


    //returns value of the card's number only (usually for calculating score of a hand)
    cardNumberValue(){
        let [, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue;
    }

    
    //card value prioritising suits
    cardValueSuitFirst(){
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return suitValue*100 + numberValue;
    }


    //used for sorting an array of Cards, prioritising suits
    static compareCardsSuitFirst(a, b) {
        return a.cardValueSuitFirst() - b.cardValueSuitFirst();
    }


    //card value prioritising numbers; used for sorting a hand and looking for potential sequences
    cardValueNumberFirst(){
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue*100 + suitValue;
    }


    //used for sorting an array of Cards, prioritiing numbers
    static compareCardsNumberFirst(a, b) {
        return a.cardValueNumberFirst() - b.cardValueNumberFirst();
    }


    //custom string representation for a Card
    toString(){
        return `${suitsText[this.suit]}${this.number}`;
    }
}