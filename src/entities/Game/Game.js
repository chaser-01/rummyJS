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




/*
This class represents a game of Rummy.
Functions are divided into:
    -Initialization: Used for initializing properties/objects for game use
    -Validation: Used for validating gamestate, melds, end-game actions, etc
    -Game actions: Used for handling non-player actions necessary in the game (dealing, next round, gamestate validation)
    -Player actions: Used for handling player actions
    -Viewing: Used for easier viewing of the game as a player/spectator

Functions that may need to be overridden in variants will state so, otherwise it's likely not.
*/
export class Game {
    //variant title; also used for loading the correct variant config file
    title = "Rummy"; 


    /*
    "enum" that represents game statuses; used for tracking what game actions should occur next:
        -PLAYER_TO_DRAW: Player must draw from deck/discard pile
        -PLAYER_TURN: Player must take some player turn action(s)
        -PLAYER_TURN_ENDED: Game must go to next player
        -ROUND_ENDED: Game must start next round
        -END_GAME: Game has ended
    */
    GameStatus = Object.freeze({
        PLAYER_TO_DRAW: Symbol('PLAYER_TO_DRAW'),
        PLAYER_TURN: Symbol('PLAYER_TURN'),
        PLAYER_TURN_ENDED: Symbol('PLAYER_TURN_ENDED'),
        ROUND_ENDED: Symbol('ROUND_ENDED'),
        END_GAME: Symbol('END_GAME')
      });


    
    /*
    Initializes important properties and stuff for playing/tracking the game:
        -gameId: Optional game ID for differentiating games
        -config: Variant configuration, to be referenced if no/invalid options were passed in
        -logger: Used for logging game/player actions, and errors/warnings
        -players: Array of players, each with an ID from playerIds array
        -initializeOptions: Function to initialize more game-specific properties, from (optional) options + config
        -score: Used for tracking and calculating player scores
        -currentPlayerIndex/currentRound: Self explanatory
        -gameStatus: Uses GameStatus enum, to track/enforce currently takeable game/player actions
        -jokerNumber: Tracks the round joker, which can replace any card in a meld; can be printed joker OR a deck wildcard
        -deck/validationCards: Deck + a copy, for validating gamestate later on

    This shouldn't be overridden in variants, since it might break initialization flow. Only override functions within it.
    */
    constructor(playerIds, options={}, gameId=undefined){
        if (gameId) this.gameId = gameId;

        this.config = this.loadConfig();

        this.logger = new Logger(this);

        this.players = this.initializePlayers(playerIds);

        this.initializeOptions(options);

        this.score = this.initializeScore(this.players);
        this.currentPlayerIndex = 0;
        this.currentRound = -1;
        this.gameStatus = this.GameStatus.ROUND_ENDED;

        this.jokerNumber = this.initializeJoker();                    
        this.deck = this.initializeDeck();
        this.validationCards = this.deck._stack.slice().sort(Card.compareCardsSuitFirst);
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Initialization functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Loads the config file for this variation (must be in same directory, and have the same name as `title`)
    loadConfig(){
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return loadConfigFile(__dirname, this.title);
    }


    /*
    Initializes (optional) options from an options object; compares to config, where applicable.
    Since jokers and wildcards shouldn't be used simultaneously, disable useWildcard option if they were both enabled.
    Variants that require additional options can override this function, then super it afterwards.
    */
    initializeOptions(options){
        this.useWildcard = setWildcardOption(this.config, options.useWildcard);
        this.useJoker = setJokerOption(this.config, options.useJoker);
        this.cardsToDraw = setCardsToDraw(this.config, options.cardsToDraw);
        this.cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this.config, options.cardsToDrawDiscardPile);
        [this.cardsToDeal, this.numberOfDecks] = setCardsToDealAndNumberOfDecks(this.config, this.players.length, options.cardsToDeal, options.numberOfDecks);

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


    //Initializes jokerNumber, which can be a printed joker OR a wildcard from the deck (depends on options/config)
    initializeJoker(){
        if (this.useJoker) return 'Joker';
        else if (this.useWildcard) return this.deck.numbers[1];
    }
    


    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Validation functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Compare current cards against validationCards + validate melds; if anything wrong, log to logger and set gameStatus to GAME_ENDED.
    //Ideally called at the start of any gamestate-modifying player action function.
    validateGameState(){
        //get deck and discard pile cards
        let checkCards = [];
        checkCards = checkCards.concat(this.deck.getCards());
        checkCards = checkCards.concat(this.deck.getDiscardPile());

        //get meld cards and validate each one
        for (const player of this.players){
            checkCards = checkCards.concat(player.hand);
            for (const meld of player.melds){
                if (meld) checkCards = checkCards.concat(meld.cards);
                if (!meld.isComplete()) { 
                    this.logger.logWarning('validateGameState', undefined, undefined, `Player ${player.id} has invalid meld: ${meld.cards}`);
                    this.gameStatus = this.GameStatus.END_GAME;
                    return false;
                }
            }
        }

        //sort checkDeck and compare with validationDeck (as strings since they don't reference same cards).
        checkCards.sort(Card.compareCardsSuitFirst);    
        if (JSON.stringify(checkCards) != JSON.stringify((this.validationCards))){
            this.logger.logWarning('validateGameState', undefined, undefined, 'Invalid game state'); 
            this.gameStatus = this.GameStatus.END_GAME;
            return false;
        }
        return true;
    }


    //Simply checks that the current gameStatus is correct
    validateGameStatus(intendedGameStatus){
        if (intendedGameStatus !== this.gameStatus) return false;
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
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.ROUND_ENDED)) return false;
        
        //increment round and, if applicable, increments jokerNumber
        this.currentRound++;
        this.currentPlayerIndex=0;
        if (this.useWildcard) this.jokerNumber = this.deck.numbers[(this.currentRound+1)%Object.keys(this.deck.numbers).length];

        //reset deck and deal cards
        this.deck = this.initializeDeck();
        for (const player of this.players){
            player.resetCards();
            player.addToHand(this.deck.draw(this.cardsToDeal));
        }

        //if it's the first round, deal extra card to first player + let them start
        if (this.currentRound===0){
            this.players[0].addToHand(this.deck.draw(1));
            this.gameStatus = this.GameStatus.PLAYER_TURN;
        }   

        //else, find the previous winner and deal them extra card + let them start
        else{
            //TO DO: get last round winner
            this.gameStatus = this.GameStatus.PLAYER_TO_DRAW;
        }

        //create next round in logger
        this.logger.logNewRound(this.currentRound);
        return true;
    }


    //Goes to the next player.
    //Note: No logging as it will be implied by logging of the next player's actions anyway
    nextPlayer(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN_ENDED)) return false;

        //while next player isn't playing or just joined (ie no cards in hand yet), go to the next next player
        while (this.players[this.currentPlayerIndex+1].playing!=true || this.players[this.currentPlayerIndex+1].hand==[]) this.currentPlayerIndex++;
        this.gameStatus = this.GameStatus.PLAYER_TO_DRAW;
        return true;
    }


    //Sets a player as not playing (keeps his hands/melds); if it's the current player, advance to next player.
    quitPlayer(playerIndex){
        if (!this.validateGameState()) return false;
        
        for (const player of this.players){
            if (player.id == playerIndex) this.players[playerIndex].playing = false;
        }
        if (this.currentPlayerIndex === playerIndex){
            gameStatus = this.GameStatus.PLAYER_TURN_ENDED;
            this.nextPlayer();
        }

        this.logger.logGameAction('quitPlayer', undefined, {playerIndex}, undefined);
        return true;
    }


    //Add a player to game. 
    addPlayer(playerId){
        if (!this.validateGameState()) return;
        this.players.push(new Player(this, playerId));
        this.logger.logGameAction('addPlayer', undefined, {playerId}, undefined); 
    }



    ////////////////////////////////////////////////////////////////////////////
    //////// Player action functions (acts on player currentPlayerIndex) ///////
    ////////////////////////////////////////////////////////////////////////////

    

    //Sorts a player's hand by suit first, and places jokers at the highest; if no playerIndex specified, defaults to current player
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

    //Sorts a player's hand by number first, and places jokers at the highest; if no playerIndex specified, defaults to current player
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


    //Draw *cardsToDraw* cards from deck and assigns to current player's hand, and set next gameStatus.
    drawFromDeck(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        let drawnCards = this.deck.draw(this.cardsToDraw);
        this.players[this.currentPlayerIndex].hand.push(drawnCards);

        this.logger.logGameAction('drawFromDeck', this.players[this.currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`); 
        this.gameStatus = this.GameStatus.PLAYER_TURN;
        return true;
    }


    //Draw *cardsToDrawFromDiscardPile* cards from discard pile and assigns to current player's hand, and set next gameStatus.
    drawFromDiscardPile(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        let drawnCards = this.deck.discardPile.draw(this.cardsToDrawDiscardPile);
        this.players[this.currentPlayerIndex].hand.push(drawnCards);

        this.logger.logGameAction('drawFromDiscardPile', this.players[this.currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`);
        this.gameStatus = this.GameStatus.PLAYER_TURN;
        return true;
    }


    //Attempt to create a meld; if invalid, log error and return. Accepts an array of indexes for the chosen cards.
    createMeld(indexArray){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        //Create a set, indexSet,  from indexArray (ensures card indexes are unique, since a set's elements will be unique)
        //Get copy of player's hand, to copy back if invalid meld/card index
        //Then, check that each index is valid, then draw corresponding card from hand and place into meld.
        let indexSet = new Set(indexArray);
        let player = this.players[this.currentPlayerIndex];
        let playerHandCopy = player.hand;
        let meldCards = [];
        for (const index of indexSet){
            if (isNaN(index) || index>player.hand.length){
                this.logger.logWarning('createMeld', this.players[this.currentPlayerIndex].id, {indexArray}, 'Invalid index array');
                player.hand = playerHandCopy;
                return false;
            }
            meldCards.concat(player.hand.splice(index, 1));
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
            player.hand = playerHandCopy;
            return false;
        }
    }


    /*
    Attempt to add to a meld; if invalid, log it. Accepts:
        -addingCardIndex: Index of card in current player's hand to add to the meld
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
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


    /*
    Attempt to replace a meld's joker (must indicate index of the card in the targeted meld); if invalid, log it. Accepts:
        -replacingCardIndex: Index of card in current player's hand to use for replacing
        -meldOwnerIndex: Index of the player who owns the meld in question
        -meldIndex: Index of the meld in the player's array of melds
        -replacedCardIndex: Index of card in target player's targeted meld, to be replaced (should be a joker)
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


    //End player turn and set gameStatus; cardIndex is the index of the card which player will discard.
    endTurn(cardIndex){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        if (cardIndex >= this.players[this.currentPlayerIndex].hand.length || isNaN(cardIndex)){
            this.logger.logWarning('endTurn', this.players[this.currentPlayerIndex].id, {cardIndex}, undefined);
            return false;
        }

        let discardedCard = this.players[this.currentPlayerIndex].hand.splice(cardIndex, 1);
        this.deck.addToDiscardPile(discardedCard);

        this.logger.logGameAction('endTurn', this.players[this.currentPlayerIndex].id, {cardIndex}, undefined);
        this.gameStatus = this.GameStatus.PLAYER_TURN_ENDED;
        return true;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Viewing functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Returns object with all information relevant to the current player
    getGameInfoForPlayer(){
        let gameInfo = {};

        gameInfo.jokerNumber = this.jokerNumber;
        gameInfo.deckSize = this.deck.remaining();
        gameInfo.topDiscardCard = this.deck.getTopOfDiscardPile();

        let player = {};
        player.id = this.players[this.currentPlayerIndex].id;
        player.hand = this.players[this.currentPlayerIndex].hand;
        player.melds = this.players[this.currentPlayerIndex].melds;

        let tableMelds = {};
        for (const player of this.players){
            tableMelds[player.id] = player.melds;
        }

        gameInfo.currentPlayer = player;
        gameInfo.tableMelds = tableMelds;
        return gameInfo;
    }
}