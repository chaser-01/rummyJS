import { Game } from '../Game/Game';
import { Card } from '../PokerDeck/Card';
import { Meld } from '../Meld/Meld';

/**
 * Represents a Rummy player.
 */
export class Player{
    /// Properties ///

    /** Game that this player belongs to. */
    game: Game;
    /** Unique ID of the player. */
    id: string;
    /** The player's hand. */
    hand: Card[];
    /** The player's melds. */
    melds: Meld[];
    /** Whether the player is currently playing. */
    playing: boolean;


    /// Methods ///


    /** Creates a Player. */
    constructor(game: Game, id: string){
        this.game = game;
        this.id = id;
        this.hand = [];
        this.melds = [];
        this.playing = true;
    }
    
    /** Adds a card to the player's hand. */
    addToHand(cards: Card[]) {this.hand = this.hand.concat(cards);}

    /** Adds a meld to the player's melds. */
    addMeld(meld) {this.melds.push(meld);}

    /** Resets the players cards. */
    resetCards() {this.hand = []; this.melds = [];}
}