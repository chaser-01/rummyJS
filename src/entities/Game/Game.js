import { GameStatus } from "./GameStatus.js";
import { GameLogger } from "./GameLogger.js";
import { PokerDeck } from "../PokerDeck/PokerDeck.js";
import { numbers } from "../../constants/constants.js";
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
        -Joker (can be printed, or wildcard)

    This shouldn't need to be overridden in variants, only the functions within it.
    */
    constructor(playerIds, options){
        this.logger = new GameLogger(self);

        initializeOptions(options); 

        this.players = initializePlayers(playerIds);
        this.currentPlayerIndex = 0;
        this.currentRound = -1;
        this.score = initializeScore(players);
        this.gameStatus = GameStatus.ROUND_ENDED;
        this.jokerNumber = initializeJoker();

        this.deck = initializeDeck();
        this.validationDeck = new Object.freeze(PokerDeck(this.numberOfDecks, this.useJoker));
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Initialization functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    /*
    Initializes (optional) options from an options object; compares to config, where applicable.
    Variants that require additional options can override this function, then super it afterwards.
    */
    initializeOptions(options){
        this.useWildcard = setWildcardOption(this.config, options.useWildcard);
        this.useJoker = setJokerOption(this.config, options.useJoker);
        this.cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this.config, options.cardsToDrawDiscardPile);
        [this.cardsToDraw, this.numberOfDecks] = setDefaultCardsToDrawAndNumberOfDecks(this.config, this.players.length, options.cardsToDraw, options.numberOfDecks);

        //Since jokers and wildcards can't (shouldn't?) be used simultaneously, if they are both enabled, disable useWildcard.
        if (this.useJoker && this.useWildcard) this.useWildcard = false;
    }


    //Initializes an array of Player objects given an array of playerIds, to assign to the game.
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new playerId(this, playerId));
        }
        return players;
    }


    //Initializes and returns a deck.
    initializeDeck(){
        let deck = new PokerDeck(this.numberOfDecks, this.useJoker);
        deck.shuffle();
        return deck;
    }


    /*
    Returns a new score object for storing/calculating scores for players.
    Variants that have different scoring systems should implement their own score subclasses, and override this function to instantiate them.
    */
    initializeScore(players){
        return new GameScore(players);
    }


    //Initializes jokerNumber.
    initializeJoker(){
        if (this.useJoker) return 'Joker';
        else if (this.useWildcard) return numbers[1];
    }
    


    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Validation functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Checks that current game state is valid, ie tally total cards, check all cards are unique and belong to deck, and all melds are valid.
    //If anything is wrong, log to logger and set gameStatus to GAME_ENDED.
    //Ideally called at the start of any gamestate-modifying player action function.
    //TO DO
    validateGameState(){

    }


    //Checks that the game is still in continuing state (ie, no player has triggered a game-ending action).
    //I think this only happens when a player finishes their hand, but not really sure.
    //Ideally called at the end of any gamestate-modifying player action function.
    //Functions with different game-ending states may need to override this.
    //TO DO
    checkGameEnded(){

    } 



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Game action functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Increment round, reset currentPlayerIndex, resets player cards and deals from a new deck.
    //If applicable, also increments jokerNumber using currentRound+1 (must % in case many rounds are played).
    nextRound(){
        if (gameStatus !== GameStatus.ROUND_ENDED) {
            this.logger.logWarning(`Can't call nextRound() if status is: ${gameStatus}`);
        }

        this.currentRound++;
        this.currentPlayerIndex=0;
        if (this.useWildcard) this.jokerNumber = numbers[(this.currentRound+1)%Object.keys(numbers).length];

        this.deck = this.initializeDeck();
        for (player of players){
            player.resetCards();
            player.addToHand(this.deck.draw(this.cardsToDraw));
        }
    }


    //Goes to the next player.
    nextPlayer(){
        if (!this.validateGameState()) return;
        if (gameStatus !== GameStatus.PLAYER_TURN_ENDED){
            this.logger(logWarning(`Can't call nextPlayer() if status is: ${gameStatus}`));
        }
        while (this.players[this.currentPlayerIndex+1].playing != true) this.currentPlayerIndex++;
        this.gameStatus = GameStatus.PLAYER_TO_DRAW;
    }


    //Sets a player as not playing (keeps his hands/melds); if it's the current player, advance to next player.
    quitPlayer(playerIndex){
        if (!this.validateGameState()) return;
        this.players[playerIndex]._playing = false;
        if (this.currentPlayerIndex === playerIndex){
            gameStatus = GameStatus.PLAYER_TURN_ENDED;
            this.nextPlayer();
        }
    }

    

    ////////////////////////////////////////////////////////////////////////////
    //////// Player action functions (acts on player currentPlayerIndex) ///////
    ////////////////////////////////////////////////////////////////////////////



    //Draw *cardsToDraw* cards from deck and assigns to current player's hand, and set next gameStatus.
    //TO DO: log it
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
    //TO DO: log it
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
    //TO DO: log it
    createMeld(indexArray){
        //General validation
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }

        //Create indexSet from indexArray, so that all indexes (and thus cards) are unique
        //Create temp copy of player hand, to copy back if the meld is invalid.
        //Then, check that each index is valid number and isn't larger than player's hand size, then draw from hand and place into meld.
        let indexSet = new Set(indexArray);
        let player = this.players[this.currentPlayerIndex];
        let playerHandCopy = player._hand.slice();
        let meldCards = [];
        for (index of indexSet){
            if (!Number.isNaN(index) || index>player._hand.length){
                this.logger.logWarning(`Invalid indexArray passed into createMeld at player: ${this.currentPlayerIndex}`);
                return;
            }
            meldCards.push(player._hand.splice(index, 1));
        } 

        //Create the meld and check validity with isComplete(). 
        //If valid, add the meld and remove cards from hand; else, reset player hand to before with the copy
        let meld = new Meld(meldCards, this.jokerNumber);
        if (meld.isComplete()){
            player.addMeld(meld);
            this.logger.logGameAction('?'); //TO DO
        }
        else{
            player._hand = playerHandCopy;
            this.logger.logWarning('?'); //TO DO
        }
    }


    /*
    Attempt to add to a meld; if invalid, log it. Accepts:
        -addingCardIndex: Index of card in current player's hand to add to the meld
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
    */
    //TO DO
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
    //TO DO
    replaceMeldJoker(replacingCardIndex, meldOwnerIndex, meldIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


    }


    //End player turn and set gameStatus; cardIndex is the index of the card  which player will discard.
    //TO DO
    endTurn(cardIndex){
        if (!this.validateGameState()) return;
        if (this.gameStatus !== GameStatus.PLAYER_TURN) {
            this.logger.logWarning(`Can't call a player action function while in gameStatus: ${this.gameStatus}`);
            return;
        }


        this.gameStatus = GameStatus.PLAYER_TURN_ENDED;
    }
}