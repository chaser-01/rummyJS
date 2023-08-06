/**
 * Represents configurable game options, that can be passed into a Game.
 * Options that aren't defined, will be automatically set using the game's config file upon initialization.
 */
export class GameOptions{

    /**
     * 
     * @param {boolean} useWildcard - Whether to use a numbered wildcard 
     * @param {boolean} useJoker - Whether to use a printed joker (can't be used with the above)
     * @param {int} cardsToDraw - Number of cards that can be drawn from the deck
     * @param {int} cardsToDrawDiscardPile - Number of cards that can be drawn from the discard pile
     * @param {int} cardsToDeal - Number of cards to deal at the start of each round
     * @param {int} numberOfDecks - Number of poker decks to put into the game deck
     */
    constructor(
        useWildcard=undefined,
        useJoker=undefined,
        cardsToDraw=undefined,
        cardsToDrawDiscardPile=undefined,
        cardsToDeal=undefined,
        numberOfDecks=undefined
    ){
        this.useWildcard=useWildcard,
        this.useJoker=useJoker,
        this.cardsToDraw=cardsToDraw,
        this.cardsToDrawDiscardPile=cardsToDrawDiscardPile,
        this.cardsToDeal=cardsToDeal,
        this.numberOfDecks=numberOfDecks

    }
}