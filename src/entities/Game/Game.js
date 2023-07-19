import { GameStatus } from "./GameStatus.js";
import { GameLogger } from "./GameLogger.js";
import { PokerDeck } from "../PokerDeck/PokerDeck.js";
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
    static config = loadConfigFile(title);


    /*  
    Initializes some necessary properties/options for the game.
    This shouldn't need to be overridden in variants, only the functions within it.
    */
    constructor(playerIds, options){
        //instantiate a logger for handling errors and tracking player turns
        this.logger = new GameLogger(self);

        //set options for initializing some game-specific things    
        initializeOptions(options);

        //initialize game-wide properties
        this.players = initializePlayers(playerIds);
        this.currentPlayerIndex = 0;
        this.currentRound = 0;
        this.score = createNewScore(players);
        this.endGame = false;

        //initialize poker deck (may involve some options), which has discardPile property
        //also initialize validationDeck which is used by validateGameState to check that gamestate hasn't been tampered with
        this.deck = new PokerDeck(this.numberOfDecks, this.useJoker);
        this.validationDeck = new Object.freeze(PokerDeck(this.numberOfDecks, this.useJoker));

        //initialize properties that manage game flow
        this.gameStatus = GameStatus.ROUND_ENDED;
        this.currentRound = 0;
        this.currentPlayerIndex = 0;
    }


    /// Initialization functions ///


    //Initializes an array of Player objects given an array of playerIds, to assign to the game.
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

        this.useWildcard = setWildcardOption(this.config, useWildcard);
        this.useJoker = setJokerOption(this.config, useJoker);
        this.cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this.config, cardsToDrawDiscardPile);
        [this.cardsToDraw, this.numberOfDecks] = setDefaultCardsToDrawAndNumberOfDecks(this.config, this.players.length, cardsToDraw, numberOfDecks);
    }

    /*
    Returns a new score object for storing/calculating scores for players.
    Variants that have different scoring systems should implement their own score subclasses, and override this function to instantiate them.
    */
    createNewScore(players){
        return new GameScore(players);
    }


    /// Game action functions ///


    //If status is correct, deals cards and resets currentPlayerIndex.
    nextRound(){
        if (gameStatus !== GameStatus.ROUND_ENDED) {
            this.logger.logWarning(`Can't call nextRound() if status is: ${gameStatus}`);}
        
        this.currentRound++;
        this.currentPlayerIndex=0;
    }

    
    //Checks that current game state is valid, ie total no. of cards is correct, all cards are valid unique deck cards, and all melds are valid.
    //If anything is wrong, log to logger and set gameStatus to GAME_ENDED.
    //Ideally called during every player action function that modifies the game state.
    validateGameState(){

    }

    
    /// Player action functions (acts on currentPlayerIndex player) ///


    //Draw *cardsToDraw* cards from deck and assigns to current player's hand, and set next gameStatus.
    //First validates game state and checks that gameStatus allows for this action.
    drawFromDeck(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TO_DRAW) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }

        let drawnCards = this.deck.draw(this.cardsToDraw);
        this.players[this.currentPlayerIndex]._hand.push(drawnCards);
        this.gameStatus = GameStatus.PLAYER_TURN;
    }

    //Draw *cardsToDrawFromDiscardPile* cards from discard pile and assigns to current player's hand, and set next gameStatus.
    //First validates game state and checks that gameStatus allows for this action.
    drawFromDiscardPile(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TO_DRAW) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }

        let drawnCards = this.deck.discardPile.draw(this.cardsToDraw);
        this.players[this.currentPlayerIndex]._hand.push(drawnCards);
        this.gameStatus = GameStatus.PLAYER_TURN;
    }

    //Attempt to create a meld; if invalid, log it.
    //First validates game state and checks that gameStatus allows for this action.
    createMeld(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    //Attempt to add to a meld; if invalid, log it.
    //First validates game state and checks that gameStatus allows for this action.
    addToMeld(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    //Attempt to replace a meld's joker; if invalid, log it.
    //First validates game state and checks that gameStatus allows for this action.
    replaceMeldJoker(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    //End player turn and set gameStatus; player must choose a card to discard.
    //First validates game state and checks that gameStatus allows for this action.
    endTurn(cardIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


        this.gameStatus = GameStatus.PLAYER_TURN_ENDED;
    }
}