import { GameStatus } from "./GameStatus.js";
import { GameLogger } from "./GameLogger.js";
import { PokerDeck } from "../PokerDeck/PokerDeck.js";
import { Meld } from "../Meld/Meld.js";
import { loadConfigFile } from "./loadConfig.js";
import { setDefaultCardsToDrawAndNumberOfDecks, setJokerOption, setWildcardOption } from "./setGameOptions.js";
import { GameScore } from "./GameScore.js";



/*
This class represents a game of Rummy.
Functions are broadly divided into the following:
    -Initialization: Used for initializing properties/objects for game use.
    -Validation: Used for validating gamestate, melds, end-game actions, etc.
    -Game actions: Used for handling non-player actions necessary in the game (dealing, next round, gamestate validation)
    -Player actions: Used for handling player actions.

Functions that may need to be overridden in variants will state so, otherwise it's likely not.
*/
export class Game {
    static title = "Rummy"; //variant title; also used for loading the correct variant config file
    static config = loadConfigFile(title); //config for the game


    /*  
    Initializes the following:
        -A logger for handling game errors and tracking game actions.
        -Properties for handling game logic and flow.
        -The deck + a validation deck for checking validity of gamestate later on.

    This shouldn't need to be overridden in variants, only the functions within it.
    */
    constructor(playerIds, options){
        this.logger = new GameLogger(self);

        initializeOptions(options);

        this.players = initializePlayers(playerIds);
        this.currentPlayerIndex = 0;
        this.currentRound = 0;
        this.score = initializeScore(players);
        this.gameStatus = GameStatus.ROUND_ENDED;

        this.deck = new PokerDeck(this.numberOfDecks, this.useJoker);
        this.validationDeck = new Object.freeze(PokerDeck(this.numberOfDecks, this.useJoker));
    }


    ///////////////////////// Initialization functions /////////////////////////


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

    //Initializes an array of Player objects given an array of playerIds, to assign to the game.
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new playerId(this, playerId));
        }
        return players;
    }

    /*
    Returns a new score object for storing/calculating scores for players.
    Variants that have different scoring systems should implement their own score subclasses, and override this function to instantiate them.
    */
    initializeScore(players){
        return new GameScore(players);
    }
    

    ///////////////////////// Validation functions /////////////////////////


    //Checks that current game state is valid, ie total no. of cards is correct, all cards are valid unique deck cards, and all melds are valid.
    //If anything is wrong, log to logger and set gameStatus to GAME_ENDED.
    //Ideally called at the start of any gamestate-modifying player action function.
    validateGameState(){

    }

    //Checks that the game is still in continuing state (ie, no player has triggered a game-ending action).
    //I think this only happens when a player finishes their hand, but not really sure.
    //Ideally called at the end of any gamestate-modifying player action function.
    //Functions with different game-ending states may need to override this.
    checkGameEnded(){

    } 


    ///////////////////////// Game action functions /////////////////////////


    //Deals cards to playing players and resets currentPlayerIndex.
    nextRound(){
        if (gameStatus !== GameStatus.ROUND_ENDED) {
            this.logger.logWarning(`Can't call nextRound() if status is: ${gameStatus}`);}
        
        this.currentRound++;
        this.currentPlayerIndex=0;
    }

    //Goes to the next player.
    nextPlayer(){
        if (gameStatus !== GameStatus.PLAYER_TURN_ENDED){
            this.logger(logWarning(`Can't call nextPlayer() if status is: ${gameStatus}`));
        }

        while (this.players[this.currentPlayerIndex+1].playing != true) this.currentPlayerIndex++;
        this.gameStatus = GameStatus.PLAYER_TO_DRAW;
        this.validateGameState();
    }

    //Sets a player as not playing (keeps his hands/melds); if it's the current player, automatically advance to next player.
    quitPlayer(playerIndex){
        this.players[playerIndex]._playing = false;
        if (this.currentPlayerIndex === playerIndex){
            gameStatus = GameStatus.PLAYER_TURN_ENDED;
            this.nextPlayer();
        }
        this.validateGameState();
    }

    
    ///////////////////////// Player action functions (acts on currentPlayerIndex player) /////////////////////////



    //Draw *cardsToDraw* cards from deck and assigns to current player's hand, and set next gameStatus.
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
    drawFromDiscardPile(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TO_DRAW) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }
        let drawnCards = this.deck.discardPile.draw(this.cardsToDrawDiscardPile);
        this.players[this.currentPlayerIndex]._hand.push(drawnCards);
        this.gameStatus = GameStatus.PLAYER_TURN;
    }

    //Attempt to create a meld; if invalid, log it. Accepts an array of indexes for the chosen cards.
    createMeld(){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    /*
    Attempt to add to a meld; if invalid, log it. Accepts:
        -addingCardIndex: Index of card in current player's hand to add to the meld
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
    */
    addToMeld(addingCardIndex, meldOwnerIndex, meldIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    /*
    Attempt to replace a meld's joker; if invalid, log it. Accepts:
        -replacingCardIndex: Index of card in current player's hand to replace
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
    */
    replaceMeldJoker(replacingCardIndex, meldOwnerIndex, meldIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }

    //End player turn and set gameStatus; cardIndex is the index of the card  which player will discard.
    endTurn(cardIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


        this.gameStatus = GameStatus.PLAYER_TURN_ENDED;
    }
}