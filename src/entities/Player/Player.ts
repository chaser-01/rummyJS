import { Game } from '../Game/Game';
import { Card } from '../PokerDeck/Card';
import { Meld } from '../Meld/Meld';

/**
 * Represents a Rummy player.
 */
export class Player{
    /// Properties ///

    /** Game that this player belongs to. */
    protected _game: Game;
    /** Unique ID of the player. */
    protected _id: string;
    /** The player's hand. */
    protected _hand: Card[];
    /** The player's melds. */
    protected _melds: Meld[];
    /** Whether the player is currently playing. */
    protected _playing: boolean;


    /// Methods ///


    /** Creates a Player. */
    constructor(game: Game, id: string){
        this._game = game;
        this._id = id;
        this._hand = [];
        this._melds = [];
        this._playing = true;
    }

    //getters/setters
    get game() {return this._game;}
    get id() {return this._id;}
    get hand() {return this._hand;}
    get melds() {return this._melds;}
    get playing() {return this._playing;}
    
    /** Adds a card to the player's hand. */
    addToHand(cards: Card[]) {this._hand = this._hand.concat(cards);}

    /** Adds a meld to the player's melds. */
    addMeld(meld: Meld) {this._melds.push(meld);}

    /** Resets the players cards. */
    resetCards() {this._hand = []; this._melds = [];}
}