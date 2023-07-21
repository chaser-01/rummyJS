import { GameStatus } from "./GameStatus.js";
import { Logger } from "../Logger/Logger.js";
import { Player } from "../Player/Player.js";
import { PokerDeck } from "../PokerDeck/PokerDeck.js";
import { Meld } from "../Meld/Meld.js";
import { loadConfigFile } from "./loadConfig.js";
import { setCardsToDrawAndNumberOfDecks, setCardsToDrawDiscardPile, setJokerOption, setWildcardOption } from "./setGameOptions.js";
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
    title = "rummy"; //variant title; also used for loading the correct variant config file
    config = loadConfigFile(this.title);

    /*  
    Initializes the following:
        -A logger for handling game errors and tracking game actions.
        -Player objects for tracking players
        -General properties for handling game logic and flow.
        -The deck + a sorted copy of its cards as validationCards, for use in validateGameState()

    This shouldn't be overridden in variants, since it might break initialization flow. Only override functions within it.
    */
    constructor(playerIds, options={}){
        this.logger = new Logger(this);

        this.players = this.initializePlayers(playerIds);
        
        this.initializeOptions(options); 

        this.score = this.initializeScore(this.players);
        this.currentPlayerIndex = 0;
        this.currentRound = -1;
        this.gameStatus = GameStatus.ROUND_ENDED;
        this.jokerNumber = this.initializeJoker();                    

        this.deck = this.initializeDeck();
        this.validationCards = this.deck._stack.slice().sort((a, b) => a.compareTo(b));;
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
        [this.cardsToDraw, this.numberOfDecks] = setCardsToDrawAndNumberOfDecks(this.config, this.players.length, options.cardsToDraw, options.numberOfDecks);

        //Since jokers and wildcards can't (shouldn't?) be used simultaneously, if they are both enabled, disable useWildcard.
        if (this.useJoker && this.useWildcard) this.useWildcard = false;
    }


    //Initializes an array of Player objects given an array of playerIds, to assign to the game.
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new Player(this, playerId));
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
        else if (this.useWildcard) return this.deck.numbers[1];
    }
    


    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Validation functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Copy all cards in-game to checkDeckm and check it against validationDeck; also, check all players' melds for validity.
    //If anything is wrong, log to logger and set gameStatus to GAME_ENDED.
    //Ideally called at the start of any gamestate-modifying player action function.
    validateGameState(){
        let checkCards = [];
        checkCards = checkCards.concat(this.deck.getCards());
        checkCards = checkCards.concat(this.deck.getDiscardPile());

        for (const player of this.players){
            checkCards = checkCards.concat(player._hand);
            for (const meld of player._melds){
                if (meld) checkCards = checkCards.concat(meld._cards);

                //if any meld isn't valid/complete, shutdown game
                if (!meld.isComplete()) { 
                    this.logger.logWarning(`Invalid meld found: ${meld._cards}; shutting down game.`);
                    this.gameStatus = GameStatus.END_GAME;
                    return false;
                }
            }
        }

        //sort checkDeck and compare with validationDeck (as strings since they don't reference same cards).
        //if not the same, cards were tampered with, so shut down game
        checkCards.sort((a, b) => a.compareTo(b));
        if (JSON.stringify(checkCards) != JSON.stringify((this.validationCards))){
            this.logger.logWarning(`Game state invalid, cards do not tally with initial deck. Shutting down game.`);
            this.gameStatus = GameStatus.END_GAME;
            return false;
        }

        return true;
    }


    //Simply checks that the current gameStatus is correct, and logs with the calling function if not.
    validateGameStatus(intendedGameStatus, functionName){
        if (intendedGameStatus !== this.gameStatus){
            this.logger.logWarning(`Can't call ${functionName} due to game status ${this.gameStatus.description}`);
            return false;
        }
        return true;
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



    //Starts the next round.
    nextRound(){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.END_GAME, 'nextRound')) return;
        
        //increment round and, if applicable, increments jokerNumber
        this.currentRound++;
        this.currentPlayerIndex=0;
        if (this.useWildcard) this.jokerNumber = this.deck.numbers[(this.currentRound+1)%Object.keys(this.deck.numbers).length];

        //if not first round, use Score object to find previous round winner so they can start first
        if (this.currentRound!=-1){
            //TO DO
        }

        //reset deck and deal cards
        this.deck = this.initializeDeck();
        for (const player of this.players){
            player.resetCards();
            player.addToHand(this.deck.draw(this.cardsToDraw));
        }

        this.gameStatus = GameStatus.PLAYER_TO_DRAW;
    }


    //Goes to the next player.
    //Note: No logging as it will be implied by logging of the next player's actions anyway
    nextPlayer(){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TURN_ENDED, 'nextPlayer')) return;

        //if next player isn't playing or just joined (no cards in hand yet), go to the next next player
        while (this.players[this.currentPlayerIndex+1].playing!=true || this.players[this.currentPlayerIndex+1]._hand==[]) this.currentPlayerIndex++;
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


    //Add a player to game. 
    //TO DO: figure out logging
    addPlayer(playerId){
        if (!this.validateGameState()) return;

        this.players.push(new Player(this, playerId));
        this.logger.logGameAction('?');
    }



    ////////////////////////////////////////////////////////////////////////////
    //////// Player action functions (acts on player currentPlayerIndex) ///////
    ////////////////////////////////////////////////////////////////////////////



    //Draw *cardsToDraw* cards from deck and assigns to current player's hand, and set next gameStatus.
    //TO DO: log it
    drawFromDeck(){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TO_DRAW, 'drawFromDeck()')) return;

        let drawnCards = this.deck.draw(this.cardsToDraw);
        this.players[this.currentPlayerIndex]._hand.push(drawnCards);

        this.logger.logGameAction('?');
        this.gameStatus = GameStatus.PLAYER_TURN;
    }


    //Draw *cardsToDrawFromDiscardPile* cards from discard pile and assigns to current player's hand, and set next gameStatus.
    //TO DO: log it
    drawFromDiscardPile(){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TO_DRAW, 'drawFromDiscardPile()')) return;

        let drawnCards = this.deck.discardPile.draw(this.cardsToDrawDiscardPile);
        this.players[this.currentPlayerIndex]._hand.push(drawnCards);

        this.logger.logGameAction('?');
        this.gameStatus = GameStatus.PLAYER_TURN;
    }


    //Attempt to create a meld; if invalid, log it. Accepts an array of indexes for the chosen cards.
    //TO DO: log it
    createMeld(indexArray){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TURN, 'createMeld()')) return;

        //Create indexSet from indexArray, so that all indexes (and thus cards) are unique
        //Create temp copy of player hand, to copy back if the meld is invalid.
        //Then, check that each index is valid number and isn't larger than player's hand size, then draw from hand and place into meld.
        let indexSet = new Set(indexArray);
        let player = this.players[this.currentPlayerIndex];
        let playerHandCopy = player._hand.slice();
        let meldCards = [];
        for (const index of indexSet){
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
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TURN, 'addToMeld()')) return;

        
    }


    /*
    Attempt to replace a meld's joker; if invalid, log it. Accepts:
        -replacingCardIndex: Index of card in current player's hand to replace
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
    */
    //TO DO
    replaceMeldJoker(replacingCardIndex, meldOwnerIndex, meldIndex){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TURN, 'replaceMeldJoker()')) return;


    }


    //End player turn and set gameStatus; cardIndex is the index of the card  which player will discard.
    //TO DO
    endTurn(cardIndex){
        if (!this.validateGameState() || !this.validateGameStatus(GameStatus.PLAYER_TURN, 'endTurn()')) return;


        this.gameStatus = GameStatus.PLAYER_TURN_ENDED;
    }
}