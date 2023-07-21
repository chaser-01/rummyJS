import { suits, numbers, suitNumberValue } from './suitsNumbers.js';

//Represents a singular card.
export class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    //card value for below sorting function
    cardValue(){
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return suitValue*100 + numberValue;
    }

    //pass this into sort() for an array of Cards
    static compareCards(a, b) {
        return a.cardValue() - b.cardValue();
    }
}