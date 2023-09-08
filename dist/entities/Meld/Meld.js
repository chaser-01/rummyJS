import { validateAndSortMeld } from './auxiliary/validateAndSortMeld';
import { validateMeldInGivenOrder } from './auxiliary/validateMeldInGivenOrder';
/** Represents a Rummy meld. */
export class Meld {
    /// Methods ///
    /** Creates a Meld. */
    constructor(cards, jokerNumber = false, maxSetSize = 4) {
        if (validateAndSortMeld(cards, jokerNumber, maxSetSize)) {
            this._cards = [...cards];
        }
        else {
            this._cards = [];
        }
        this.jokerNumber = jokerNumber;
        this.maxSetSize = maxSetSize;
    }
    /** The meld's cards. */
    get cards() { return this._cards; }
    /**
     * Validates an array of cards and sorts them if they form a valid meld.
     * If no cards are passed in, operates on the instance's cards.
     */
    checkAndSortMeld(cards = this._cards, jokerNumber = this.jokerNumber, maxSetSize = this.maxSetSize) {
        return validateAndSortMeld(cards, jokerNumber, maxSetSize);
    }
    /**
     * Validates an array of cards as a meld, in the given order.
     * If the cards form a meld in a different order, still returns false.
     * If no cards are passed in, operates on the instance's cards.
     */
    checkMeldInGivenOrder(cards = this._cards, jokerNumber = this.jokerNumber, maxSetSize = this.maxSetSize) {
        return validateMeldInGivenOrder(cards, jokerNumber, maxSetSize);
    }
    /**
     * Attempts to add a card to the meld at the specified index.
     * If the cards form a meld in a different order, the meld will still not be successfully modified.
    */
    addCardSpecific(newCard, newCardPosition) {
        let modifiedCards = [...this._cards];
        modifiedCards.splice(newCardPosition, 0, newCard);
        if (validateMeldInGivenOrder(modifiedCards, this.jokerNumber, this.maxSetSize)) {
            this._cards = modifiedCards;
            return true;
        }
        return false;
    }
    /**
     * Attempts to add a card to the meld.
     * Will automatically move the card to the correct position for a valid meld.
    */
    addCard(newCard) {
        let modifiedCards = [...this._cards];
        modifiedCards.push(newCard);
        if (this.checkAndSortMeld(modifiedCards, this.jokerNumber, this.maxSetSize)) {
            this._cards = modifiedCards;
            return true;
        }
        return false;
    }
    /**
     * Attempts to replace the specified card with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
    replaceCard(newCard, replacedIndex) {
        if (this._cards[replacedIndex].number != this.jokerNumber)
            return false;
        let modifiedCards = [...this._cards];
        modifiedCards.splice(replacedIndex, 1, newCard);
        if (this.checkAndSortMeld(modifiedCards, this.jokerNumber, this.maxSetSize)) {
            let replacedCard = this._cards.splice(replacedIndex, 1, newCard)[0];
            return replacedCard;
        }
        return false;
    }
    /**
     * Attempts to replace the first possible joker with a new card, and verify the meld's validity.
     * Returns the replaced card if successful, and false if not.
     */
    replaceAnyJoker(newCard) {
        for (let i = 0; i < this._cards.length; i++) {
            if (this._cards[i].number == this.jokerNumber) {
                let modifiedCards = [...this._cards];
                let replacedCard = modifiedCards.splice(i, 1, newCard)[0];
                if (this.checkAndSortMeld(modifiedCards, this.jokerNumber, this.maxSetSize)) {
                    return replacedCard;
                }
            }
        }
        return false;
    }
    /**
     * A string representation for the meld.
     * @override
     */
    toString() {
        return `${this._cards.map(card => `${card}`)}`;
    }
}
