/**  Generic deck (an array with some generic deck functionality). */
export declare class Deck<T> {
    /** The card stack. */
    private _stack;
    /** Creates a Deck. */
    constructor(cards?: T[]);
    /** Returns the deck cards. */
    getCards(): T[];
    /** Returns the deck size. */
    remaining(): number;
    /** Shuffles the deck (Fisher–Yates implementation adapted from http://bost.ocks.org/mike/shuffle/) */
    shuffle(): void;
    /** Draws specified amount of cards from top of the deck. */
    draw(count: number): T[];
    /** Adds cards (or 1 card) to the top of the deck. */
    addToTop(cards: T[]): void;
}
