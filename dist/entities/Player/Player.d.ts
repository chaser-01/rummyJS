import { Game } from '../Game/Game';
import { Card } from '../PokerDeck/Card';
import { Meld } from '../Meld/Meld';
/**
 * Represents a Rummy player.
 */
export declare class Player {
    /** Game that this player belongs to. */
    protected _game: Game;
    /** Unique ID of the player. */
    protected _id: string;
    /** The player's hand. */
    protected _hand: Card[];
    /** The player's melds. */
    protected _melds: Meld[];
    /** Whether the player is currently playing. */
    playing: boolean;
    /** Creates a Player. */
    constructor(game: Game, id: string);
    get game(): Game;
    get id(): string;
    get hand(): Card[];
    get melds(): Meld[];
    /** Adds card(s) to the player's hand. */
    addToHand(cards: Card[] | Card): void;
    /** Draws cards, as specified by index(es), from the player's hand. */
    drawFromHand(indexes: number[] | number): Card[];
    /** Adds a meld to the player's melds. */
    addMeld(meld: Meld): void;
    /** Attempts to add a card to a specified meld. */
    addCardToMeld(card: Card, meldIndex: number): boolean;
    /** Attempts to add a card to a specified meld at a specified position. */
    addCardToMeldSpecific(card: Card, meldIndex: number, position: number): boolean;
    /** Resets the players cards. */
    resetCards(): void;
}
