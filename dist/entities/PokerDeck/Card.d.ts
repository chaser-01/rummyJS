import { suits, numbers } from './suitsNumbers';
/** Represents a poker card. */
export declare class Card {
    /** The card's suit. */
    suit: keyof typeof suits;
    /** The card's number. */
    number: keyof typeof numbers;
    /** Creates a Card. */
    constructor(suit: keyof typeof suits, number: keyof typeof numbers);
    /** Returns the value of a card's number only (typically for Rummy score calculation). */
    cardNumberValue(): number;
    /**  Returns the value of a card, prioritising suit THEN number. */
    cardValueSuitFirst(): number;
    /** Used as callback function for sorting an array of cards, prioriting suit. */
    static compareCardsSuitFirst(a: Card, b: Card): number;
    /** Returns the value of a card, prioritising number THEN suit. */
    cardValueNumberFirst(): number;
    /**  Used as a callback function for sorting an array of cards, prioritising number (more commonly used). */
    static compareCardsNumberFirst(a: Card, b: Card): number;
    /**
     * Custom string representation for a card.
     * @override
     */
    toString(): string;
}
