//necessary objects
import { GameScore } from "./GameScore.js";
import { Logger } from "../Logger/Logger.js";
import { Player } from "../Player/Player.js";
import { PokerDeck } from "../PokerDeck/PokerDeck.js";
import { Card } from "../PokerDeck/Card.js";
import { Meld } from "../Meld/Meld.js";

//some auxiliary functions
import { loadConfigFile } from "./auxiliary/loadConfig.js";
import { setCardsToDealAndNumberOfDecks, setCardsToDraw, setCardsToDrawDiscardPile, setJokerOption, setWildcardOption } from "./auxiliary/setGameOptions.js";

//path functions, for getting config file regardless of variant location
import * as path from 'path';
import { fileURLToPath } from 'url';




/**
 * Represents a game of Rummy.
 */
export class Game {
    //variant title; also used for loading the correct variant config file
    title = "Rummy"; 


    /**
     * @constant
     * An "enum" that represents statuses the game can take.
     * The game/player actions that can be taken at any point of time are determined by the current status.
     * It is assigned to the 'gameStatus' property.
     */
    GameStatus = Object.freeze({
        PLAYER_TO_DRAW: Symbol('PLAYER_TO_DRAW'),
        PLAYER_TURN: Symbol('PLAYER_TURN'),
        PLAYER_TURN_ENDED: Symbol('PLAYER_TURN_ENDED'),
        ROUND_ENDED: Symbol('ROUND_ENDED'),
        END_GAME: Symbol('END_GAME')
      });


    /**
     * Creates a Game.
     * Don't override this in variants as it may mess with initialization flow; instead override individual functions as required.
     * @constructor
     * @modifies {gameId} - Optional, for uniquely identifying a game
     * @modifies {config} - The game's config file
     * @modifies {logger} - Used for logging game/player actions
     * @modifies {players} - Array of player objects
     * @modifies {quitPlayers} - Array of players who have quit
     * @modifies {initialOptions} - Stores the options that were passed into constructor
     * @modifies {score} - Tracks/evaluates player scores
     * @modifies {currentPlayerIndex} - Tracks the current player
     * @modifies {currentRound} - Tracks the current round
     * @modifies {gameStatus} - Tracks the current game status (and what actions can be taken)
     * @modifies {deck} - The game deck
     * @modifies {jokerNumber} - The joker (can be printed, or a wildcard)
     * @modifies {validationCards} - A copy of the deck, for validation later on
     * @param {int[]} playerIds - An array of player's IDs
     * @param {GameOption} options - Optional options to configure the game (see GameOption class)
     * @param {int} gameId - Optional game ID
     */
    constructor(playerIds, options={}, gameId=undefined){
        if (gameId) this.gameId = gameId;
        this.config = this.loadConfig();
        this.logger = new Logger(this);
        this.players = this.initializePlayers(playerIds);
        this.quitPlayers = [];
        this.initialOptions = options;
        this.initializeOptions(this.initialOptions);
        this.score = this.initializeScore(this);
        this.currentPlayerIndex = 0;
        this.currentRound = 0;
        this.gameStatus = this.GameStatus.ROUND_ENDED;
        [this.deck, this.jokerNumber, this.validationCards] = this.initializeDeckJokerAndValidationCards();
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Initialization functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////


    
    /**
     * Loads a json config file for the game (must be located in same directory, and named same as the class 'title' property)
     * @returns {Object} - An object containing default configuration options
     */
    loadConfig(){
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return loadConfigFile(__dirname, this.title);
    }


    /**
     * Initializes options that determine some customizable, game-specific variables.
     * Options are explained in the GameOptions documentation.
     * @param {GameOptions} options - Optional options to configure the game
     * @modifies {useWildcard}
     * @modifies {useJoker} 
     * @modifies {cardsToDraw}
     * @modifies {cardsToDrawDiscardPile}
     * @modifies {cardsToDeal}
     * @modifies {numberOfDecks}
     */
    initializeOptions(options){
        this.useWildcard = setWildcardOption(this.config, options.useWildcard);
        this.useJoker = setJokerOption(this.config, options.useJoker);
        this.cardsToDraw = setCardsToDraw(this.config, options.cardsToDraw);
        this.cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this.config, options.cardsToDrawDiscardPile);
        [this.cardsToDeal, this.numberOfDecks] = setCardsToDealAndNumberOfDecks(this.config, this.players.length, options.cardsToDeal, options.numberOfDecks);

        if (this.useJoker && this.useWildcard) this.useWildcard = false;
    }


    /**
     * Initializes an array of player objects
     * @param {int[]} playerIds
     * @returns {Player[]}
     */
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new Player(this, playerId));
        }
        return players;
    }


    /**
     * Initializes a Score object, which is used for tracking/calculating score for each round
     * @param {Game} game 
     * @returns {GameScore}
     */
    initializeScore(game){
        return new GameScore(game);
    }


    /**
     * Initializes deck, joker (printed or wildcard, depending on game configuration), and a copy of the deck for validation later.
     * @returns {int, int, Card[]} 
     */
    initializeDeckJokerAndValidationCards(){
        let deck = new PokerDeck(this.numberOfDecks, this.useJoker);
        let validationCards = deck._stack.slice().sort(Card.compareCardsSuitFirst);
        deck.shuffle();
        
        //set joker either to printed joker ('Joker') or wildcard, or nothing.
        //wildcard number is (currentRound+1)%(size of deck numbers)
        let jokerNumber;
        if (this.useJoker) jokerNumber = 'Joker';
        else if (this.useWildcard) jokerNumber = getWildcardNumber();
        else jokerNumber = undefined;

        return [deck, jokerNumber, validationCards];
    }


    /**
     * Get the current wildcard number if wildcards are enabled, upon start of each round.
     * Variants may handle wildcards differently, so overriding this method may be useful.
     * Currently, wildcard starts at 2 and increments on each round.
     * @modifies {jokerNumber}
     * @returns {string | boolean}
     */
    getWildcardNumber(){
        if (useWildcard){
            return deck.numbers[this.currentRound+1 % Object.keys(deck.numbers).length];
        }
        else return false;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Validation functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    /**
     * Validates that the cards in play tally with validationCards, and all melds are valid.
     * @modifies {gameStatus} - sets to END_GAME if game state is invalid
     * @modifies {logger} - Logs ending of game if game state is invalid
     * @returns {boolean} - Whether game state is valid
     */
    validateGameState(){
        //get deck and discard pile cards
        let checkCards = [];
        checkCards.push(...this.deck.getCards());
        checkCards.push(...this.deck.getDiscardPile());

        //for each player, add their hand cards to checkCards; then validate each meld, then add the cards to checkCards
        for (const player of this.players){
            checkCards.push(...player.hand);
            for (const meld of player.melds){
                if (meld) checkCards.push(...meld.cards);
                if (!meld.isComplete()) { 
                    this.logger.logWarning('validateGameState', undefined, undefined, `Player ${player.id} has invalid meld: ${meld.cards}`);
                    this.setGameStatus(this.GameStatus.END_GAME);
                    return false;
                }
            }
        }

        //sort checkCards and compare with validationCards (as strings, since they don't reference the same card objects)
        checkCards.sort(Card.compareCardsSuitFirst);    
        if (JSON.stringify(checkCards) != JSON.stringify((this.validationCards))){
            this.logger.logWarning('validateGameState', undefined, undefined, 'Invalid game state'); 
            this.setGameStatus(this.GameStatus.END_GAME);
            return false;
        }
        return true;
    }

    //Simply checks that the current gameStatus is correct
    validateGameStatus(intendedGameStatus){
        if (intendedGameStatus !== this.gameStatus) return false;
        return true;
    }


    /**
     * @modifies {}
     * @modifies {logger} 
     * @returns {boolean}
     */

    //TO DO
    checkRoundEnded(){
        if (!this.players[this.currentPlayerIndex].hand && this.players[this.currentPlayerIndex].playing){
            this.logger.logGameAction(
                'checkRoundEnded', 
                undefined, 
                undefined, 
                `Current player ${this.players[this.currentPlayerIndex].hand.id} has finished hand. Ending round`
                )
            this.score.evaluateRoundScore();
            this.game
            return false;
        }
        return true;
    }
    

    
    /**
     * Checks that the game has ended (should only be if 1 player is left?)
     * @modifies {gameStatus} - Sets to END_GAME if game can't continue
     * @modifies {logger}
     * @returns {boolean}
     */

    //TO DO: OR the wildcard has run through entire deck? OR hit some limit on number of rounds? we'll see
    checkGameEnded(){
        let still_playing=0;
        for (player of this.players){
            if (player.playing) still_playing++;
        }

        if (still_playing<=1){
            this.logger.logGameAction('checkGameEnded', undefined, undefined, '<=1 player left, ending game');
            this.setGameStatus(this.GameStatus.END_GAME);
            return false;
        }
        return true;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Game action functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    


    /**
     * Verifies that the input is a GameStatus, and sets it
     * @modifies {gameStatus} - Sets to the input gameStatus
     * @param {GameStatus} gameStatus 
     * @returns {boolean}
     */
    setGameStatus(gameStatus){
        if (!Object.keys(this.GameStatus).find(status => status = gameStatus)) return false;
        this.gameStatus = gameStatus;
        return true;
    }


    
    /** 
     * Does some things (explained below) to start the next round.
     * @modifies {currentRound}
     * @modifies {score}
     * @modifies {players, quitPlayers}
     * @modifies {useWildcard, useJoker, cardsToDraw, cardsToDrawDiscardPile, cardsToDeal, numberOfDecks}
     * @modifies {gameStatus}
     * @modifies {logger}
     * @returns {boolean}
     */
    nextRound(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.ROUND_ENDED)) return false;

        this.currentRound++;

        //calculate the round score
        this.score.evaluateRoundScore();

        //moves just-quit players to quitPlayers, and just-unquit players to players
        for (const [index, player] of this.players.entries()){
            if (!player.playing) this.quitPlayers.push(...this.players.splice(index, 1));
        }
        for (const [index, player] of this.quitPlayers.entries()){
            if (player.playing) this.players.push(...this.quitPlayers.splice(index, 1));
        }

        //create next round in score object
        this.score.initializeRound();
        
        //set game config again (particularly cardsToDeal, if number of players changed)
        this.initializeOptions(this.initialOptions);

        //reset deck and get the next jokerNumber (if wildcard, it will increment)
        [this.deck, this.jokerNumber, this.validationCards] = this.initializeDeckJokerAndValidationCards();
        
        //deal cards
        for (const player of this.players){
            player.resetCards();
            player.addToHand(this.deck.draw(this.cardsToDeal));
        }

        //if it's the first round, deal extra card to first player + let them start
        if (this.currentRound===1){
            this.players[0].addToHand(this.deck.draw(1));
            this.setGameStatus(this.GameStatus.PLAYER_TURN);
        }   

        //else, find the previous winner and deal them extra card + let them start
        else{
            //TO DO: get last round winner
            this.setGameStatus(this.GameStatus.PLAYER_TO_DRAW);
        }

        this.logger.logNewRound(this.currentRound);
        return true;
    }


    /**
     * Goes to the next player.
     * While the next player isn't playing, go to the next next player.
     * @modifies {currentPlayerIndex}
     * @modifies {gameStatus}
     * @modifies {gameStatus}
     * @returns {boolean}
     */
    nextPlayer(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN_ENDED)) return false;

        //while next player isn't playing, go to the next next player (modulo no. of players, to loop back to first player)
        do {this.currentPlayerIndex++;}
        while (!this.players[(this.currentPlayerIndex+1) % (this.players.length)].playing)

        this.setGameStatus(this.GameStatus.PLAYER_TO_DRAW);
        return true;
    }


    /**
     * Sets a player as having quit; keeps their cards in their possession for current round.
     * @modifies {logger}
     * @param {int} playerIndex - Index of the player who is quitting (default is current player)
     * @returns {boolean}
     */
    quitPlayer(playerIndex=this.currentPlayerIndex){
        if (!this.validateGameState()) return false;

        if (playerIndex > this.players.length) return false;

        this.players[playerIndex].playing = false;
        if (this.checkGameEnded()) return true;
        if (this.currentPlayerIndex === playerIndex){
            this.setGameStatus(this.GameStatus.PLAYER_TURN_ENDED);
            this.nextPlayer();
        }
        this.logger.logGameAction('quitPlayer', this.players[playerIndex].id, {playerIndex}, undefined);
        return true;
    }


    /**
     * Unquits a player who was playing; they will continue next round with their previous round scores intact.
     * @modifies {logger}
     * @param {integer} playerId - ID of the player to unquit
     * @returns {boolean}
     */
    unquitPlayer(playerId){
        if (!this.validateGameState()) return false;

        for (const [index, player] of this.quitPlayers.entries()){
            if (player.id == playerId){
                unquitter = this.quitPlayers.splice(index, 1);
                this.players.push(...unquitter);
                this.logger.logGameAction('unquitPlayer', playerId, {playerId}, undefined);
                return true;
            }
        }
        return false;
    }


    
    /**
     * Adds a new player to the game.
     * @modifies {logger}
     * @param {integer} playerId - ID of the new player
     * @returns {boolean}
     */
    addPlayer(playerId){
        if (!this.validateGameState()) return;
        this.players.push(new Player(this, playerId));
        this.logger.logGameAction('addPlayer', playerId, {playerId}, undefined); 
    }


    //Forces ending the game
    //TO DO
    forceEndGame(){

    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////// Player action functions (acts on current player) /////////////
    ////////////////////////////////////////////////////////////////////////////

    
    
    /**
     * Sorts a player's hand, by suit THEN by number
     * @modifies {players[playerIndex]}
     * @modifies {logger}
     * @param {int} playerIndex - Default is current player
     * @returns {boolean}
     */
    //TO DO: this is broken (probably the comparison function), plz fix
    sortHandBySuit(playerIndex = this.currentPlayerIndex){
        if (!this.validateGameState()) return false;

        this.players[playerIndex].hand.sort((a, b) => {
            if (a.number == this.jokerNumber && b.number == this.jokerNumber) return Card.compareCardsSuitFirst(a, b);
            if (a.number == this.jokerNumber) return 1;
            if (b.number == this.jokerNumber) return -1;
            return Card.compareCardsSuitFirst(a, b);
        })

        this.logger.logGameAction('sortHandBySuit', this.players[playerIndex].id, undefined, undefined);
        return true;
    }


    /**
     * Sorts a player's hand, by number THEN by suit (most commonly used sort)
     * @modifies {players[playerIndex]}
     * @modifies {logger}
     * @param {*} playerIndex - Default is current player
     * @returns {boolean}
     */
    sortHandByNumber(playerIndex = this.currentPlayerIndex){
        if (!this.validateGameState()) return false;

        this.players[playerIndex].hand.sort((a, b) => {
            if (a.number == this.jokerNumber && b.number == this.jokerNumber) return Card.compareCardsNumberFirst(a, b);
            if (a.number == this.jokerNumber) return 1;
            if (b.number == this.jokerNumber) return -1;
            return Card.compareCardsNumberFirst(a, b);
        })

        this.logger.logGameAction('sortHandByNumber', this.players[playerIndex].id, undefined, undefined);
        return true;
    }


    
    /**
     * Draws 'cardsToDraw' cards from the deck, for the current player.
     * @modifies {deck}
     * @modifies {gameStatus}
     * @modifies {players[currentPlayerIndex]}
     * @modifies {logger}
     * @returns {boolean}
     */
    drawFromDeck(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        let drawnCards = this.deck.draw(this.cardsToDraw);
        this.players[this.currentPlayerIndex].hand.push(...drawnCards);

        this.logger.logGameAction('drawFromDeck', this.players[this.currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`); 
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    /**
     * Draws 'cardsToDrawDiscardPile' cards from the discard pile, for the current player.
     * If insufficient cards in discard pile, returns false.
     * @modifies {deck}
     * @modifies {gameStatus}
     * @modifies {players[currentPlayerIndex]}
     * @modifies {logger}
     * @returns {boolean}
     */
    drawFromDiscardPile(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        if (this.deck.getDiscardPileSize() < this.cardsToDrawDiscardPile) return false;

        let drawnCards = this.deck.drawFromDiscardPile(this.cardsToDrawDiscardPile);
        this.players[this.currentPlayerIndex].hand.push(...drawnCards);

        this.logger.logGameAction('drawFromDiscardPile', this.players[this.currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`);
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    /**
     * Attempts to create a meld out of chosen cards in the current player's hand.
     * @modifies {players[currentPlayerIndex]}
     * @modifies {logger}
     * @param {int[]} indexArray - Array of integers representing indexes of chosen cards in the hand
     * @returns {boolean}
     */
    createMeld(indexArray){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        //Create a set, indexSet,  from indexArray (ensures card indexes are unique, since a set's elements will be unique)
        //Copy player's hand to playerHandCopy, to copy back if invalid meld/card index
        //Then, check that each index is valid, then draw corresponding card from hand and place into an array.
        let indexSet = new Set(indexArray);
        let player = this.players[this.currentPlayerIndex];
        let playerHandCopy = player.hand.slice();
        let meldCards = [];
        for (const index of indexSet){
            if (isNaN(index) || index>player.hand.length){
                this.logger.logWarning('createMeld', this.players[this.currentPlayerIndex].id, {indexArray}, 'Invalid index array');
                player.hand = playerHandCopy;
                return false;
            }
            meldCards.push(...player.hand.splice(index, 1));
        } 

        //Create the meld object, and check if meld is valid.
        //If so, add the meld to player's melds; else, reset the player's hand
        let meld = new Meld(meldCards, this.jokerNumber);
        if (meld.isComplete()){
            player.addMeld(meld);
            this.logger.logGameAction('createMeld', this.players[this.currentPlayerIndex].id, {indexArray});
            return true;
        }
    
        else{
            this.logger.logWarning('createMeld', this.players[this.currentPlayerIndex].id, {indexArray}, 'Invalid meld');
            this.invalidMeldDeclaration();
            player.hand = playerHandCopy;
            return false;
        }
    }


    /**
     *  
     */
    invalidMeldDeclaration(){

    }


    /**
     * Attempts to add a specified card in current player's hand, to a specified meld, of a specified player.
     * @modifies {players[currentPlayerIndex]}
     * @modifies {player[meldOwnerIndex]}
     * @modifies {logger}
     * @param {int} addingCardIndex 
     * @param {int} meldOwnerIndex 
     * @param {int} meldIndex 
     * @returns {boolean}
     */
    addToMeld(addingCardIndex, meldOwnerIndex, meldIndex){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return;

        let potentialMeld = this.players[meldOwnerIndex].melds[meldIndex];
        let addingCard = this.players[this.currentPlayerIndex].hand[addingCardIndex];

        if (potentialMeld.addCard(addingCard, this.jokerNumber)){
            this.players[meldOwnerIndex].melds[meldIndex] = potentialMeld;
            this.players[this.currentPlayerIndex].hand.splice(addingCardIndex, 1);

            this.logger.logGameAction('addToMeld', this.players[this.currentPlayerIndex].id, {addingCardIndex, meldOwnerIndex, meldIndex});
            return true;
        }

        else{
            this.logger.logWarning(
                'addToMeld',
                this.players[this.currentPlayerIndex].id,
                {addingCardIndex, meldOwnerIndex, meldIndex},
                'Invalid meld addition'
                );
            return false;
        }
    }


    /**
     * Attempts to replace a specified card (only jokers?) in a specified meld, with a specified card in current player's hand.
     * @modifies {players[currentPlayerIndex]}
     * @modifies {players[meldOwnerIndex]}
     * @modifies {logger}
     * @param {int} replacingCardIndex 
     * @param {int} meldOwnerIndex 
     * @param {int} meldIndex 
     * @param {int} replacedCardIndex 
     * @returns {boolean}
     */
    replaceMeldCard(replacingCardIndex, meldOwnerIndex, meldIndex, replacedCardIndex){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return;

        let potentialMeld = this.players[meldOwnerIndex].melds[meldIndex];
        let replacingCard = this.players[this.currentPlayerIndex].hand[replacingCardIndex];

        if (potentialMeld.replaceCard(replacingCard, replacingIndex, this.jokerNumber)){
            this.players[meldOwnerIndex].melds[meldIndex] = potentialMeld;
            this.players[this.currentPlayerIndex].hand.splice(replacingCardIndex, 1);

            this.logger.logGameAction(
                'replaceMeldCard',
                this.players[this.currentPlayerIndex].id,
                {replacingCardIndex, meldOwnerIndex, meldIndex, replacedCardIndex}
                );
            return true;
        }

        else{
            this.logger.logWarning(
                'replaceMeldCard',
                this.players[this.currentPlayerIndex].id,
                {replacingCardIndex, meldOwnerIndex, meldIndex, replacedCardIndex},
                'Invalid card replacement'
            );
            return false;
        }
    }

    
    /**
     * End current player's turn, and choose a card in hand to discard.
     * @modifies {gameStatus}
     * @modifies {players[currentPlayerIndex]}
     * @modifies {logger}
     * @param {int} cardIndex 
     * @returns {boolean}
     */
    endTurn(cardIndex){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        if (cardIndex >= this.players[this.currentPlayerIndex].hand.length || isNaN(cardIndex)){
            this.logger.logWarning('endTurn', this.players[this.currentPlayerIndex].id, {cardIndex}, undefined);
            return false;
        }

        let discardedCard = this.players[this.currentPlayerIndex].hand.splice(cardIndex, 1);
        this.deck.addToDiscardPile(discardedCard);
        this.logger.logGameAction('endTurn', this.players[this.currentPlayerIndex].id, {cardIndex}, undefined);
        this.setGameStatus(this.GameStatus.PLAYER_TURN_ENDED);
        return true;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Viewing functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    /**
     * Returns an object with information useful for a player (defaults to current player)
     * @param {playerIndex}
     * @returns 
     */
    getGameInfoForPlayer(playerIndex = this.currentPlayerIndex){
        let gameInfo = {};

        gameInfo.jokerNumber = this.jokerNumber;
        gameInfo.deckSize = this.deck.remaining();
        gameInfo.topDiscardCard = this.deck.getTopOfDiscardPile();
        gameInfo.discardPileSize = this.deck.getDiscardPileSize();

        let player = {};
        player.id = this.players[playerIndex].id;
        player.hand = this.players[playerIndex].hand;
        player.melds = this.players[playerIndex].melds;

        let tableMelds = {};
        for (const player of this.players){
            tableMelds[player.id] = player.melds;
        }

        gameInfo.currentPlayer = player;
        gameInfo.tableMelds = tableMelds;
        return gameInfo;
    }
}