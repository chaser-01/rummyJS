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
    Initializes important properties and stuff for playing/tracking the game.
    This shouldn't be overridden in variants, since it might break initialization flow. Only override functions within it.
    */
    constructor(playerIds, options={}, gameId=undefined){
        if (gameId) this.gameId = gameId;

        this.config = this.loadConfig();

        this.logger = new Logger(this);

        this.players = this.initializePlayers(playerIds);
        this.quitPlayers = [];

        this.initialOptions = options;
        [
        this.useWildcard,
        this.useJoker,
        this.cardsToDraw,
        this.cardsToDrawDiscardPile,
        this.cardsToDeal, 
        this.numberOfDecks
        ] = this.initializeOptions(this.initialOptions);

        this.score = this.initializeScore(this.players);
        this.currentPlayerIndex = 0;
        this.currentRound = 0;
        this.gameStatus = this.GameStatus.ROUND_ENDED;
                
        [this.deck, this.jokerNumber, this.validationCards] = this.initializeDeckJokerAndValidationCards();
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Initialization functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Loads the config file for this variation (must be in same directory, and have the same name as title property)
    loadConfig(){
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return loadConfigFile(__dirname, this.title);
    }


    /*
    Initializes (optional) and returns options from an options object; compares to config, where applicable.
    Since jokers and wildcards shouldn't be used simultaneously, disable useWildcard option if they were both enabled.
    Variants that require additional options can override this function, then super it afterwards.
    */
    initializeOptions(options){
        let useWildcard = setWildcardOption(this.config, options.useWildcard);
        let useJoker = setJokerOption(this.config, options.useJoker);
        let cardsToDraw = setCardsToDraw(this.config, options.cardsToDraw);
        let cardsToDrawDiscardPile = setCardsToDrawDiscardPile(this.config, options.cardsToDrawDiscardPile);
        let cardsToDeal, numberOfDecks;
        [cardsToDeal, numberOfDecks] = setCardsToDealAndNumberOfDecks(this.config, this.players.length, options.cardsToDeal, options.numberOfDecks);

        if (this.useJoker && this.useWildcard) this.useWildcard = false;

        return [
            useWildcard,
            useJoker,
            cardsToDraw,
            cardsToDrawDiscardPile,
            cardsToDeal, 
            numberOfDecks
            ]
    }


    //Initializes an array of Player objects given an array of playerIds, to assign to the game.
    initializePlayers(playerIds){
        let players = [];
        for (const playerId of playerIds){
            players.push(new Player(this, playerId));
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


    //Returns a deck and joker/wildcard if applicable, based upon options/config
    initializeDeckJokerAndValidationCards(){
        let deck = new PokerDeck(this.numberOfDecks, this.useJoker);
        let validationCards = deck._stack.slice().sort(Card.compareCardsSuitFirst);
        deck.shuffle();
        
        //set joker either to printed joker ('Joker') or wildcard, or nothing.
        //wildcard number is (currentRound+1)%(size of deck numbers)
        let jokerNumber;
        if (this.useJoker) jokerNumber = 'Joker';
        else if (this.useWildcard) jokerNumber = deck.numbers[this.currentRound+1 % Object.keys(deck.numbers).length];
        else jokerNumber = undefined;

        return [deck, jokerNumber, validationCards];
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Validation functions /////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    //Compare current cards against validationCards + validate melds; if anything wrong, log and set gameStatus to GAME_ENDED.
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
                    this.setGameStatus(this.GameStatus.END_GAME);
                    return false;
                }
            }
        }

        //sort checkDeck and compare with validationDeck (as strings, since they don't reference the same card objects).
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


    //Checks that the round has ended; ie, if any player has triggered a game-ending action.
    //I think this only happens when a player finishes their hand, but not really sure.
    //Ideally called at the end of any gamestate-modifying player action function.
    //Functions with different game-ending states may need to override this.
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
    

    //Check if the game can no longer continue, ie 1/0 players left.
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
    


    //Simply sets game status to input GameStatus
    setGameStatus(gameStatus){
        if (!Object.keys(this.GameStatus).find(status => status = gameStatus)) return false;
        this.gameStatus = gameStatus;
        return true;
    }


    //Does some stuff to start next round
    nextRound(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.ROUND_ENDED)) return false;

        this.currentRound++;

        //calculate the round score
        this.score.evaluateRoundScore();

        //moves just-quit players to quitPlayers, and just-unquit players to players
        for (const [index, player] of this.players.entries()){
            if (!player.playing) this.quitPlayers.concat(this.players.splice(index, 1));
        }
        for (const [index, player] of this.quitPlayers.entries()){
            if (player.playing) this.players.concat(this.quitPlayers.splice(index, 1));
        }

        //create next round in score object
        this.score.initializeNextRound(this.players);
        
        //get config again, since, if number of players changed, current configuration may not be useable
        [
        this.useWildcard,
        this.useJoker,
        this.cardsToDraw,
        this.cardsToDrawDiscardPile,
        this.cardsToDeal, 
        this.numberOfDecks
        ] = this.initializeOptions(this.initialOptions);

        

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


    //Goes to the next player.
    //Note: No logging as it will be implied by logging of the next player's actions anyway
    nextPlayer(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN_ENDED)) return false;

        //while next player isn't playing or just joined (ie no cards in hand yet), go to the next next player (modulo no. of players, to loop back to first player)
        do {this.currentPlayerIndex++;}
        while (!this.players[(this.currentPlayerIndex+1) % (this.players.length)].playing || 
                this.players[(this.currentPlayerIndex+1) % (this.players.length)].hand==[])

        this.setGameStatus(this.GameStatus.PLAYER_TO_DRAW);
        return true;
    }


    /*
    Quits a player by setting their playing property to false. Upon next round, they will be moved to quitPlayers.
    If it's current player, skip turn and go to next player immediately.
    Upon each quit, checkGameEnded checks that enough players are present to continue the game.
    */
    quitPlayer(playerIndex){
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


    /*
    Unquits a previously playing player (must be in quitPlayers), by reversing the above actions.
    They will not be assigned any cards yet, and will be moved from quitPlayers to players next round.
    */
    unquitPlayer(playerId){
        if (!this.validateGameState()) return false;

        for (const [index, player] of this.quitPlayers.entries()){
            if (player.id == playerId){
                unquitter = this.quitPlayers.splice(index, 1);
                this.players.concat(unquitter);
                this.logger.logGameAction('unquitPlayer', playerId, {playerId}, undefined);
                return true;
            }
        }
        return false;
    }


    //Add a player to game. 
    addPlayer(playerId){
        if (!this.validateGameState()) return;
        this.players.push(new Player(this, playerId));
        this.score.addPlayer(playerId);
        this.logger.logGameAction('addPlayer', playerId, {playerId}, undefined); 
    }


    //Forces ending the game
    //TO DO
    forceEndGame(){

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
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    //Draw *cardsToDrawFromDiscardPile* cards from discard pile and assigns to current player's hand, and set next gameStatus.
    //If insufficient cards in discard pile, return false.
    drawFromDiscardPile(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        if (this.deck.getDiscardPileSize() <= this.cardsToDrawDiscardPile) return false;

        let drawnCards = this.deck.drawFromDiscardPile(this.cardsToDrawDiscardPile);
        this.players[this.currentPlayerIndex].hand.push(drawnCards);

        this.logger.logGameAction('drawFromDiscardPile', this.players[this.currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`);
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    //Attempt to create a meld; if invalid, log error and return. Accepts an array of indexes for the chosen cards.
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
        this.setGameStatus(this.GameStatus.PLAYER_TURN_ENDED);
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
        gameInfo.discardPileSize = this.deck.getDiscardPileSize();

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