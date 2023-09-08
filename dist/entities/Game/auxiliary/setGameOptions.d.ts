import { GameConfig } from "./extraTypes";
export declare function setWildcardOption(config: GameConfig, useJoker: boolean | undefined): boolean;
export declare function setJokerOption(config: GameConfig, useWildcard: boolean | undefined): boolean;
export declare function setCardsToDraw(config: GameConfig, cardsToDraw: number | undefined): number;
export declare function setCardsToDrawDiscardPile(config: GameConfig, cardsToDrawDiscardPile: number | "all" | undefined): number | "all";
export declare function setCardsToDealAndNumberOfDecks(config: GameConfig, playersSize: number, cardsToDeal: number | undefined, numberOfDecks: number | undefined): number[];
