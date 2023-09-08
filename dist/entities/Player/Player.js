/**
 * Represents a Rummy player.
 */
export class Player {
    /// Methods ///
    /** Creates a Player. */
    constructor(game, id) {
        this._game = game;
        this._id = id;
        this._hand = [];
        this._melds = [];
        this.playing = true;
    }
    //any required getters/setters
    get game() { return this._game; }
    get id() { return this._id; }
    get hand() { return this._hand; }
    get melds() { return this._melds; }
    /** Adds card(s) to the player's hand. */
    addToHand(cards) { this._hand = this._hand.concat(cards); }
    /** Draws cards, as specified by index(es), from the player's hand. */
    drawFromHand(indexes) {
        if (typeof indexes == "number") {
            return this._hand.splice(indexes, 1);
        }
        else {
            indexes.sort((a, b) => b - a);
            let cards = [];
            this._hand = this._hand.filter((val, index) => {
                let presentInIndexes = indexes.indexOf(index);
                if (presentInIndexes != -1)
                    cards.push(val);
                return (presentInIndexes == -1);
            });
            return cards;
        }
    }
    /** Adds a meld to the player's melds. */
    addMeld(meld) { this._melds.push(meld); }
    /** Attempts to add a card to a specified meld. */
    addCardToMeld(card, meldIndex) {
        let meld = this._melds[meldIndex];
        if (meld) {
            if (meld.addCard(card))
                return true;
        }
        return false;
    }
    /** Attempts to add a card to a specified meld at a specified position. */
    addCardToMeldSpecific(card, meldIndex, position) {
        let meld = this._melds[meldIndex];
        if (meld) {
            if (meld.addCardSpecific(card, position))
                return true;
        }
        return false;
    }
    /** Resets the players cards. */
    resetCards() { this._hand = []; this._melds = []; }
}
