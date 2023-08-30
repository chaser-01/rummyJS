import { Card } from "../../PokerDeck/Card"
import { Meld } from "../../Meld/Meld"


//Storing of some types used in Game here


//interface for the Game's options
export interface GameOptions {
    useWildcard?: boolean,
    useJoker?: boolean,
    cardsToDraw?: number,
    cardsToDrawDiscardPile?: number|"all",
    cardsToDeal?: number,
    numberOfDecks?: number
}


//interface for object returned from getGameInfoForPlayer
export interface ExternalGameInfo {
    jokerNumber: string|false,
    deckSize: number,
    topDiscardCard: Card,
    discardPileSize: number
    currentPlayer: {id: string, hand: Card[], melds: Meld[]}
    tableMelds: {[playerId: string]: Meld[]}
}


/**
 * Interface for the config file; variants should extend this if they provide additional options.
 * Basically all GameOptions properties but required, and 
 * cardsToDeal is a nested object: decks -> deckAmt -> players -> playerAmt: dealAmt
 */
export type GameConfig = Omit<Required<GameOptions>, "cardsToDeal"> & {
    cardsToDeal: {[decks: string]: {[deckAmt: number]: {[players: string]:{[playerAmt: number]: number}}}}
}