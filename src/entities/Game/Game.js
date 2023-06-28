import { PokerDeck } from "../PokerDeck/PokerDeck";
import { loadConfigFile } from "./loadConfig.js";
import { setDefaultCardsToDrawAndNumberOfDecks, setJokerOption, setWildcardOption } from "./setGameOptions.js";
import { GameScore } from "./GameScore.js";
import { GameRound } from "./GameRound.js";


/*
This class represents a generic game of Rummy.
TO DO: write this out
*/
export class Game {
    //variant title; also used for loading the correct variant config file
    title = "Rummy";

    //config for the game
    static _config = loadConfigFile(title);

    /*
    Initializes changeable properties, ie options, through initializeOptions.
    Initializes properties that are (i think?) common across all Rummy variants.
    Initializes a deck (based on options), and a round (for handling round logic).
    */
    constructor(playerIds, options){    
        initializeOptions(options);

        this._players = initializePlayers(playerIds);
        this._currentPlayerIndex = 0;
        this._currentRound = 0;
        this._score = createNewScore(players);
        this._endGame = false;

        this._deck = new PokerDeck(this._numberOfDecks, this._useJoker);

        this._round = createRound();
        this._currentRound = 1;
    }

    /// Initialization functions ///

    //Initializes an array of Player objects given an array of playerIds, to assign to the Game.
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new playerId(this, playerId));
        }
        return players;
    }

    /*
    Initializes options from an options object; compares to config, where applicable.
    Current options are:
        -useJoker: Whether to use printed jokers
        -useWildcard: Whether to use numerical wildcards
        -cardsToDraw: Specify the number of cards for each player to draw
        -numberOfDecks: Specify the number of poker decks used in the game deck
        -cardsToDrawDiscardPile: Specify the number of cards to draw from the discard pile
    
    Variants that require additional options can override this function, then super it afterwards.
    */
    initializeOptions(options){
        let useJoker = options.useJoker;
        let useWildcard = options.useWildcard;
        let cardsToDraw = options.cardsToDraw;
        let numberOfDecks = options.numberOfDecks;
        let cardsToDrawDiscardPile = options.cardsToDrawDiscardPile;

        this._useWildcard = setWildcardOption(this._config, useWildcard);
        this._useJoker = setJokerOption(this._config, useJoker);
        this._cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this._config, cardsToDrawDiscardPile);
        [this._cardsToDraw, this._numberOfDecks] = setDefaultCardsToDrawAndNumberOfDecks(this._config, this._players.length, cardsToDraw, numberOfDecks);
    }

    /*
    Returns a new score object for storing/calculating scores for players.
    Variants that have different scoring systems should implement their own score subclasses, and override this function to instantiate them.
    */
    createNewScore(players){
        return new GameScore(players);
    }

    /// Game functions ///

    /*
    Starts the game.
    While the _endGame flag isn't true,
        -Calls startRound on the round.
        -When it returns, increment currentRound.
    */
    startGame(){
        while (!_endGame){
            this._round.startRound();
            this._currentRound++;
        }
    }

    /*
    Returns a Round object for handling round logic.
    Variants with different round logic should implement their own round subclass, and override this function to instantiate them.
    */
    createRound(){
        return new GameRound(this);
    }
}