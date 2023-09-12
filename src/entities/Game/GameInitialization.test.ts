import { Game } from "./Game";
import { GameInitialization } from "./GameInitialization";
import { GameOptions } from "./auxiliary/extraTypes";
import { PokerDeck } from "../PokerDeck/PokerDeck";
import { Card } from "../PokerDeck/Card";

/// 

//just initializes and calls initializeOptions
function initGameInit(gameOptions: GameOptions, players: number) {
    let gameInit = new GameInitialization(gameOptions);
    gameInit.initializeOptions('rummy', players);
    return gameInit;
}

///

describe('GameInitialization', () => {
    test('should initialize', () => {
        let gameInit = new GameInitialization({});
        expect(gameInit.gameOptions).toEqual({});
    })

    test('should initialize gameOptions during initializeOptions, if one was not passed in', () => {
        //initializes all options from default
        expect(initGameInit({}, 2).gameOptions).toEqual({
            useJoker: true,
            useWildcard: false,
            cardsToDraw: 1,
            cardsToDrawDiscardPile: 1,
            cardsToDeal: 10,
            numberOfDecks: 1
        });
    })

    test('should modify gameOptions during initializeOptions, for invalid/missing options', () => {
        //all missing options will be initialized, but cardsToDraw remains since it is valid
        expect(initGameInit({
            cardsToDraw: 2
        }, 2).gameOptions)
        .toEqual({
            useJoker: true,
            useWildcard: false,
            cardsToDraw: 2,
            cardsToDrawDiscardPile: 1,
            cardsToDeal: 10,
            numberOfDecks: 1
        })

        //if the option is present but invalid (cardsToDraw>52), it will be modified to the config default
        expect(initGameInit({
            cardsToDraw: 999
        }, 2).gameOptions)
        .toEqual({
            useJoker: true,
            useWildcard: false,
            cardsToDraw: 1,
            cardsToDrawDiscardPile: 1,
            cardsToDeal: 10,
            numberOfDecks: 1
        })
    })

    test('should initialize deck, jokers and validation cards using the options', () => {
        let gameInit = initGameInit({}, 2);
        let pokerdeck = new PokerDeck(1, true);
        let result = gameInit.initializeDeckAndJoker();
        expect(result[0].getCards().sort(pokerdeck.compareCards)).toEqual(pokerdeck.getCards().sort(pokerdeck.compareCards));
        expect(result[1]).toEqual("Joker");
    })
})