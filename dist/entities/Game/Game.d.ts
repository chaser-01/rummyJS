import * as GameStatus from "./GameStatus";
import { GameScore } from "./GameScore";
import { Logger } from "../Logger/Logger";
import { Player } from "../Player/Player";
import { PokerDeck } from "../PokerDeck/PokerDeck";
import { Card } from "../PokerDeck/Card";
import { GameOptions, GameConfig, ExternalGameInfo } from "./auxiliary/extraTypes.js";
/** Represents a game of Rummy. */
export declare class Game {
    /** The variant title; used for accessing the variant's config file too. */
    readonly title = "Rummy";
    /** An enum of possible game statuses. */
    readonly GameStatus: typeof GameStatus.GameStatus;
    /** Default configuration for the variant. */
    protected _config: GameConfig;
    protected _useWildcard: boolean;
    protected _useJoker: boolean;
    protected _cardsToDraw: number;
    protected _cardsToDrawDiscardPile: number | "all";
    protected _cardsToDeal: number;
    protected _numberOfDecks: number;
    readonly gameId: string;
    protected _logger: Logger;
    protected _players: Player[];
    protected _quitPlayers: Player[];
    protected _initialOptions: GameOptions;
    protected _score: GameScore;
    protected _currentPlayerIndex: number;
    protected _currentRound: number;
    protected _gameStatus: keyof typeof GameStatus.GameStatus;
    protected _deck: PokerDeck;
    protected _jokerNumber: keyof typeof this._deck.numbers | false;
    protected _validationCards: Card[];
    /**
     * Creates a Game.
     * Don't override this in variants as it may mess with initialization flow; instead, override individual functions as required.
     */
    constructor(playerIds: string[], options?: GameOptions, gameId?: string);
    get config(): GameConfig;
    get useWildcard(): boolean;
    get useJoker(): boolean;
    get jokerNumber(): false | "Joker" | "Ace" | "Two" | "Three" | "Four" | "Five" | "Six" | "Seven" | "Eight" | "Nine" | "Ten" | "Jack" | "Queen" | "King";
    get cardsToDraw(): number;
    get cardsToDrawDiscardPile(): number | "all";
    get cardsToDeal(): number;
    get numberOfDecks(): number;
    get logger(): Logger;
    get players(): Player[];
    get quitPlayers(): Player[];
    get score(): GameScore;
    get currentPlayerIndex(): number;
    get currentRound(): number;
    get gameStatus(): "PLAYER_TO_DRAW" | "PLAYER_TURN" | "PLAYER_TURN_ENDED" | "ROUND_ENDED" | "END_GAME";
    get deck(): PokerDeck;
    get validationCards(): Card[];
    /**
     * Loads a json config file for the game (must be located in same directory, and named same as the class 'title' property.
     * Variants with their own config objects should override this with the appropriate config type.
     */
    private loadConfig;
    /**
     * Initializes options that determine some customizable game-specific stuff.
     * Variants with their own options should override this, then super it.
    */
    protected initializeOptions(options: GameOptions): [boolean, boolean, number, number | "all", number, number];
    /** Initializes an array of player objects. */
    protected initializePlayers(playerIds: string[]): Player[];
    /** Initializes a score object which is used for tracking/calculating score for current round. */
    protected initializeScore(): GameScore;
    /** Initializes deck, joker (printed/wildcard/none, depending on game configuration), and a copy of the deck for validation later. */
    protected initializeDeckJokerAndValidationCards(): [PokerDeck, keyof typeof this._deck.numbers | false, Card[]];
    /**
     * Get the current wildcard number if wildcards are enabled, upon start of each round.
     * Variants may handle wildcards differently, so overriding this method may be useful.
     * Currently, wildcard starts at 2 and increments on each round.
     */
    protected getWildcardNumber(_deck: PokerDeck): false | "Joker" | "Ace" | "Two" | "Three" | "Four" | "Five" | "Six" | "Seven" | "Eight" | "Nine" | "Ten" | "Jack" | "Queen" | "King";
    /** Validates that the cards in play tally with validationCards, and all melds are valid. */
    protected validateGameState(): boolean;
    /** Simply checks that the current _gameStatus is correct. */
    validateGameStatus(intended_GameStatus: keyof typeof this.GameStatus): boolean;
    /**
     * Checks if the round has ended.
     * Normally only occurs when the current (playing) player runs out their hand, but variants may have different conditions.
     */
    protected checkRoundEnded(): boolean;
    /**
     * Checks if the game has ended.
     * Normally only occurs if <=1 player is left playing, but variants may have different conditions.
     */
    protected checkGameEnded(): boolean;
    /** Setter for _gameStatus. */
    protected setGameStatus(_gameStatus: keyof typeof this.GameStatus): boolean;
    /**
     * Does some things necessary housekeeping to initiate next round.
     */
    protected nextRound(): boolean;
    /** Goes to the next player. While the next player isn't playing, go to the next next player. */
    nextPlayer(): boolean;
    /** Sets a player as having quit; keeps their cards in their possession for current round. */
    quitPlayer(playerIndex?: number): boolean;
    /** Unquits a player who was playing; they will continue next round with their previous round _scores intaS. */
    unquitPlayer(playerId: string): boolean;
    /** Adds a new player to the game. */
    addPlayer(playerId: string): void;
    forceEndGame(): void;
    /** Sorts a player's hand, by suit THEN by number. */
    sortHandBySuit(playerIndex?: number): boolean;
    /** Sorts a player's hand, by number THEN by suit. Defaults to current _players. */
    sortHandByNumber(playerIndex?: number): boolean;
    /** Draws `_cardsToDraw` cards from the deck, for the current player. */
    drawFromDeck(): boolean;
    /**
     * Draws '_cardsToDrawDiscardPile' cards from the discard pile, for the current player.
     * If insufficient cards in discard pile, returns false.
     */
    drawFromDiscardPile(): boolean;
    /** Attempts to create a meld out of chosen cards in the current player's hand. */
    createMeld(indexArr: number[]): boolean;
    /**
     * Creates a forfeit for the current player if they declared an invalid meld, since some Rummy variants have such a rule.
     * Called automatically by createMeld in the case of invalid meld.
     * Doesn't do anything currently, but can be overridden if needed.
     */
    invalidMeldDeclaration(): void;
    /**  Attempts to add a specified card in current player's hand, to a specified meld, of a specified player. */
    addToMeld(addingCardIndex: number, meldOwnerIndex: number, meldIndex: number): boolean | undefined;
    /** Attempts to replace a specified card (only jokers?) in a specified meld, with a specified card in current player's hand. */
    replaceMeldCard(replacingCardIndex: number, meldOwnerIndex: number, meldIndex: number, replacedCardIndex: number): boolean | undefined;
    /** End current player's turn, and choose a card in hand to discard. */
    endTurn(cardIndex: number): boolean;
    /** Returns an object with information useful for a specified player (defaults to current player). */
    getGameInfoForPlayer(playerIndex?: number): ExternalGameInfo;
}
