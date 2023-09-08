import { suits, numbers } from './suitsNumbers';
import { Card } from './Card';
import { Deck } from './Deck';
/**
 * Represents a poker deck.
 * Automatically populates the deck with poker cards, and has additional discardPile property of type Deck.
 */
export declare class PokerDeck extends Deck<Card> {
    /** Access suits enum through the class. */
    suits: typeof suits;
    /** Access suits enum through the class. */
    numbers: typeof numbers;
    /** The deck's discard pile. */
    private _discardPile;
    /** Creates a PokerDeck by iterating over all possible suits and numbers. */
    constructor(numberOfDecks?: number, useJoker?: boolean);
    /** Draws cards from the deck. Automatically shuffles the discard pile back into deck, if the deck is too small. */
    draw(count: number): Card[];
    /** Returns copy of the deck. */
    getDiscardPile(): Card[];
    /** Returns the deck size. */
    getDiscardPileSize(): number;
    getTopOfDiscardPile(): Card;
    /** Adds a card to the top of the discard pile. */
    addToDiscardPile(card: Card): void;
    /** Draws from the discard pile. */
    drawFromDiscardPile(count: number): Card[];
    /**  Puts the discard pile back onto the top of the deck. */
    resetDiscardPile(): void;
}
