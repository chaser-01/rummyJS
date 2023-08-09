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
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    /**
     * Returns the value of a card's number only (typically for Rummy score calculation).
     * @returns {int}
     */
    cardNumberValue(){
        let [, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue;
    }


    /**
     * Returns the value of a card, prioritising suit THEN number.
     * @returns {int}
     */
    cardValueSuitFirst(){
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return suitValue*100 + numberValue;
    }

    /**
     * Used as callback function for sorting an array of cards, prioriting suit.
     * @param {Card} a 
     * @param {Card} b 
     * @returns {int}
     */
    static compareCardsSuitFirst(a, b) {
        return a.cardValueSuitFirst() - b.cardValueSuitFirst();
    }


    /**
     * Returns the value of a card, prioritising number THEN suit.
     * @returns {int}
     */
    cardValueNumberFirst(){
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue*100 + suitValue;
    }

    /**
     * Used as a callback function for sorting an array of cards, prioritising number (more commonly used).
     * @param {Card} a 
     * @param {Card} b 
     * @returns {int}
     */
    static compareCardsNumberFirst(a, b) {
        return a.cardValueNumberFirst() - b.cardValueNumberFirst();
    }


    /**
     * Custom string representation of a card.
     * @override
     * @returns {string}
     */
    toString(){
        return `${suitsText[this.suit]}${this.number}`;
    }
}