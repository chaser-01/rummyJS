import { suits, numbers, suitsText, numbersText } from './suitsNumbers';
/** Represents a poker card. */
export class Card {
    /// Methods ///
    /** Creates a Card. */
    constructor(suit, number) {
        //Only allow Jokers to have suit and number = 'Joker'
        //Looping over suits and numbers WILL throw error if you don't account for this!!!
        if ((suit == 'Joker' && number != 'Joker') || (suit != 'Joker' && number == 'Joker')) {
            throw new Error(`Cannot instantiate a Joker if both suit and number aren't "Joker".`);
        }
        this.suit = suit;
        this.number = number;
    }
    /** Returns the value of a card's number only (typically for Rummy score calculation). */
    cardNumberValue() {
        return numbers[this.number];
    }
    /**  Returns the value of a card, prioritising suit THEN number. */
    cardValueSuitFirst() {
        return suits[this.suit] * 100 + numbers[this.number];
    }
    /** Used as callback function for sorting an array of cards, prioriting suit. */
    static compareCardsSuitFirst(a, b) {
        return a.cardValueSuitFirst() - b.cardValueSuitFirst();
    }
    /** Returns the value of a card, prioritising number THEN suit. */
    cardValueNumberFirst() {
        return numbers[this.number] * 100 + suits[this.suit];
    }
    /**  Used as a callback function for sorting an array of cards, prioritising number (more commonly used). */
    static compareCardsNumberFirst(a, b) {
        return a.cardValueNumberFirst() - b.cardValueNumberFirst();
    }
    /**
     * Custom string representation for a card.
     * @override
     */
    toString() {
        return `${suitsText[this.suit]}${numbersText[this.number]}`;
    }
}
