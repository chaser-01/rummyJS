import { Card } from "../../PokerDeck/Card";
import { numbers } from "../../PokerDeck/suitsNumbers";
export declare function validateMeldInGivenOrder(cards: Card[], jokerNumber?: (keyof typeof numbers | false), maxSetSize?: number): boolean;
