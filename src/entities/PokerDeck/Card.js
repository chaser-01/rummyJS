import { suits, numbers } from './suitsNumbers.js';

//Represents a singular card.
export class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    compareTo(otherCard) {
        const rankOrder = Object.keys(numbers);
        const suitOrder = Object.keys(suits);

        const rankComparison = rankOrder.indexOf(this.rank) - rankOrder.indexOf(otherCard.rank);
        const suitComparison = suitOrder.indexOf(this.suit) - suitOrder.indexOf(otherCard.suit);

        // If ranks are different, return the rank comparison result
        if (rankComparison !== 0) {
        return rankComparison;
        }

        // If ranks are the same, return the suit comparison result
        return suitComparison;
    }
}