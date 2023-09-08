import { Card } from "../../PokerDeck/Card";
import { numbers } from "../../PokerDeck/suitsNumbers";
/** Validates an array of cards as a meld, and sorts the cards into the valid meld in-place. */
export declare function validateAndSortMeld(cards: Card[], jokerNumber?: (keyof typeof numbers | false), maxSetSize?: number): boolean;
