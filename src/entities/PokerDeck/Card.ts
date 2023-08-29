import { suits, numbers, suitNumberValue, suitsText } from './suitsNumbers';

/** Represents a poker card. */
export class Card {
    /// Properties ///

    
    /** The card's suit (must correspond to one in suits). */
    suit: keyof typeof suits;
    /** The card's number (must correspond to one in numbers). */
    number: keyof typeof numbers;


    /// Methods ///


    /**
     * Creates a Card.
     * @constructor
     */
    constructor(suit: keyof typeof suits, number: keyof typeof numbers) {
        this.suit = suit;
        this.number = number;
    }


    /**
     * Returns the value of a card's number only (typically for Rummy score calculation).
     */
    cardNumberValue(): number{
        let [, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue;
    }


    /**  Returns the value of a card, prioritising suit THEN number. */
    cardValueSuitFirst(): number{
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return suitValue*100 + numberValue;
    }


    /** Used as callback function for sorting an array of cards, prioriting suit. */
    static compareCardsSuitFirst(a: Card, b: Card): number{
        return a.cardValueSuitFirst() - b.cardValueSuitFirst();
    }


    /** Returns the value of a card, prioritising number THEN suit. */
    cardValueNumberFirst(): number{
        let suitValue, numberValue;
        [suitValue, numberValue] = suitNumberValue(this.suit, this.number);
        return numberValue*100 + suitValue;
    }

    /**  Used as a callback function for sorting an array of cards, prioritising number (more commonly used). */
    static compareCardsNumberFirst(a: Card, b: Card): number{
        return a.cardValueNumberFirst() - b.cardValueNumberFirst();
    }


    /**
     * Custom string representation for a card.
     * @override
     */
    toString(): string{
        if (this.number=='Joker') return 'Joker';
        return `${suitsText[this.suit]}${this.number}`;
    }
}