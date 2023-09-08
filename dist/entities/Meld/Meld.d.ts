import { Card } from '../PokerDeck/Card';
import { numbers } from '../PokerDeck/suitsNumbers';
/** Represents a Rummy meld. */
export declare class Meld {
    /** The meld cards. */
    _cards: Card[];
    /** The optional joker number; if present, must be a key in `numbers`. If none, it is false. */
    jokerNumber: keyof typeof numbers | false;
    /** The maximum size for a set. Rules dictate that this is by default 4. */
    maxSetSize: number;
    /** Creates a Meld. */
    constructor(cards: Card[], jokerNumber?: (keyof typeof numbers | false), maxSetSize?: number);
    /** The meld's cards. */
    get cards(): Card[];
    /**
     * Validates an array of cards and sorts them if they form a valid meld.
     * If no cards are passed in, operates on the instance's cards.
     */
    checkAndSortMeld(cards?: Card[], jokerNumber?: (keyof typeof numbers | false), maxSetSize?: number): boolean;
    /**
     * Validates an array of cards as a meld, in the given order.
     * If the cards form a meld in a different order, still returns false.
     * If no cards are passed in, operates on the instance's cards.
     */
    checkMeldInGivenOrder(cards?: Card[], jokerNumber?: (keyof typeof numbers | false), maxSetSize?: number): boolean;
    /**
     * Attempts to add a card to the meld at the specified index.
     * If the cards form a meld in a different order, the meld will still not be successfully modified.
    */
    addCardSpecific(newCard: Card, newCardPosition: number): boolean;
    /**
     * Attempts to add a card to the meld.
     * Will automatically move the card to the correct position for a valid meld.
    */
    addCard(newCard: Card): boolean;
    /**
     * Attempts to replace the specified card with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
    replaceCard(newCard: Card, replacedIndex: number): Card | false;
    /**
     * Attempts to replace the first possible joker with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
    replaceAnyJoker(newCard: Card): Card | false;
    /**
     * A string representation for the meld.
     * @override
     */
    toString(): string;
}
