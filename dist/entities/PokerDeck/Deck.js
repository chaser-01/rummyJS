/**  Generic deck (an array with some generic deck functionality). */
export class Deck {
    /// Methods ///
    /** Creates a Deck. */
    constructor(cards = []) {
        if (!Array.isArray(cards))
            this._stack = [];
        else
            this._stack = cards;
        return this;
    }
    /** Returns the deck cards. */
    getCards() {
        return [...this._stack];
    }
    /** Returns the deck size. */
    remaining() {
        return this._stack.length;
    }
    /** Shuffles the deck (Fisher–Yates implementation adapted from http://bost.ocks.org/mike/shuffle/) */
    shuffle() {
        var remaining = this._stack.length;
        var tmp;
        var idx;
        // While there remain elements to shuffle…
        while (remaining) {
            // Pick a remaining element...
            idx = Math.floor(Math.random() * remaining--);
            // And swap it with the current element.
            tmp = this._stack[remaining];
            this._stack[remaining] = this._stack[idx];
            this._stack[idx] = tmp;
        }
    }
    /** Draws specified amount of cards from top of the deck. */
    draw(count) {
        if (!count)
            return [];
        let drawnCards = this._stack.splice(this._stack.length - count, count);
        return drawnCards;
    }
    /** Adds cards (or 1 card) to the top of the deck. */
    addToTop(cards) {
        this._stack.push(...cards);
    }
}
