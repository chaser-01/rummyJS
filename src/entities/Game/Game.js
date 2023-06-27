import { PokerDeck } from "../PokerDeck/PokerDeck";
import { loadConfigFile } from "./loadConfig.js";
import { setDefaultCardsToDrawAndNumberOfDecks, setJokerOption, setWildcardOption } from "./setGameOptions.js";
import { GameScore } from "./GameScore.js";


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
    Does the following:
        -Initializes game options (may differ variant to variant)
        -Initializes general game info (likely reuseable across rummy variants)
        -Initializes the deck
    */
    constructor(players, options){
        initializeOptions(options);
            
        this._players = players;
        this._currentPlayerIndex = 0;
        this._currentRound = 0;
        this._score = createNewScore(players);
        this._endGame = false;

        this._deck = new PokerDeck(this._numberOfDecks, this._useJoker);
    }



    // INITIALIZATION FUNCTIONS //



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

        this.useWildcard = setWildcardOption(this._config, useWildcard);
        this.useJoker = setJokerOption(this._config, useJoker);
        this.cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this._config, cardsToDrawDiscardPile);
        [this.cardsToDraw, this.numberOfDecks] = setDefaultCardsToDrawAndNumberOfDecks(this._config, this._players.length, cardsToDraw, numberOfDecks);
    }

    /*
    Returns a new score object for storing/calculating scores for players.
    Variants that have different scoring systems should implement their own score subclasses, and override this function to instantiate them.
    */
    createNewScore(players){
        return new GameScore(players);
    }

    

    // GAME FUNCTIONS // 



    /*
    Starts the game.
    While the _endGame flag isn't true,
        -Creates a new GameRound and calls startRound.
        -Once round finishes, increments round.
    */
    startGame(){
        
    } 

    /*
    Sets _endGame to true.
    */
    setEndGameFlag(){
        this._endGame = true;
    }
}