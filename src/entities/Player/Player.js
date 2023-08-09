/**
 * Represents a Rummy player.
 */
export class Player{
    /**
     * Creates a Player.
     * @param {Game} game 
     * @param {string|int} id 
     */
    constructor(game, id){
        this.game = game;
        this.id = id;
        this.hand = [];
        this.melds = [];
        this.playing = true;
    }
    
    /**
     * Adds a card to the player's hand.
     * @modifies {hand}
     * @param {*} cards 
     */
    addToHand(cards) {this.hand = this.hand.concat(cards);}

    /**
     * Adds a meld to the player's melds.
     * @modifies {melds}
     * @param {Meld} meld 
     */
    addMeld(meld) {this.melds.push(meld);}

    /**
     * Resets the players cards.
     * @modifies {hand}
     * @modifies {melds}
     */
    resetCards() {this.hand = []; this.melds = [];}
}