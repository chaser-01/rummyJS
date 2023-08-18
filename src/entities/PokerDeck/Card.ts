import { suitNumberValue, suitsText } from './suitsNumbers.js';

/**
 * Represents a poker card.
 */
export class Card {
    /**
     * Creates a Card.
     * @constructor
     * @param {string} suit - A suit (must be a value from suitNumbers' suits object)
     * @param {string} number - A number (must be a value from suitsNumbers' numbers object)
     */
    constructor(suit: string, number: string) {
        this.suit = suit;
        this.number = number;
    }

    /**
     * Returns the value of a card's number only (typically for Rummy score calculation).
     * @returns {number}
     */
    cardNumberValue(): number{
        let [, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue;
    }


    /**
     * Returns the value of a card, prioritising suit THEN number.
     * @returns {inumbernt}
     */
    cardValueSuitFirst(): number{
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return suitValue*100 + numberValue;
    }

    /**
     * Used as callback function for sorting an array of cards, prioriting suit.
     * @param {Card} a 
     * @param {Card} b 
     * @returns {number}
     */
    static compareCardsSuitFirst(a: Card, b: Card): number{
        return a.cardValueSuitFirst() - b.cardValueSuitFirst();
    }


    /**
     * Returns the value of a card, prioritising number THEN suit.
     * @returns {number}
     */
    cardValueNumberFirst(): number{
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue*100 + suitValue;
    }

    /**
     * Used as a callback function for sorting an array of cards, prioritising number (more commonly used).
     * @param {Card} a 
     * @param {Card} b 
     * @returns {number}
     */
    static compareCardsNumberFirst(a: Card, b: Card): number{
        return a.cardValueNumberFirst() - b.cardValueNumberFirst();
    }


    /**
     * Custom string representation of a card.
     * @override
     * @returns {string}
     */
    toString(): string{
        if (this.number=='Joker') return 'Joker';
        return `${suitsText[this.suit]}${this.number}`;
    }
}