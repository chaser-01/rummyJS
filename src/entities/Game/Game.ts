//necessary objects
import * as GameStatus from "./GameStatus";
import { GameScore } from "./GameScore";
import { Logger } from "../Logger/Logger";
import { Player } from "../Player/Player";
import { PokerDeck } from "../PokerDeck/PokerDeck";
import { Card } from "../PokerDeck/Card";
import { Meld } from "../Meld/Meld";

//some utility functions
import { GameInitialization } from "./GameInitialization";
import { validateAndSortMeld } from "../Meld/auxiliary/validateAndSortMeld"; 

//import some useful types
import { GameOptions, ExternalGameInfo } from "./auxiliary/extraTypes.js";




/** Represents a game of Rummy. */
export class Game {
    /// Properties ///


    /** The variant title; used for accessing the variant's config file too. */
    readonly title = "Rummy"; 
    /** An enum of possible game statuses. */
    readonly GameStatus = GameStatus.GameStatus;
    /** Optional identifier for a game. */
    readonly gameId: string;

    //initialization object; useful if we need to re-initialize options at some point
    protected gameInitialization: GameInitialization;

    //Used for game tracking
    protected _logger: Logger;
    protected _players: Player[];
    protected _quitPlayers: Player[];
    protected _score: GameScore;
    protected _currentPlayerIndex: number;
    protected _currentRound: number;
    protected _gameStatus: keyof typeof GameStatus.GameStatus;

    //Game deck related
    protected _deck: PokerDeck;
    protected _jokerNumber: keyof typeof this._deck.numbers|false;
    protected _validationCards: Card[];
    protected _cardsToDraw: number;
    protected _cardsToDrawDiscardPile: number|"all";
    protected _cardsToDeal: number;


    /// Methods ///     


    /**
     * Creates a game.
     * @param playerIds - Array of player's IDs
     * @param options - Optional options to customize some aspects of the game
     * @param gameId - Optional game ID
     * @param gameInitialization - Optional initialization class; pass one in if you use custom initialization functionality
     */
    constructor(playerIds: string[], options: GameOptions={}, gameId: string='', gameInitialization = new GameInitialization(options)){
        this.gameInitialization = gameInitialization;
        this.gameInitialization.initializeOptions(this.title, playerIds.length);

        this.gameId = gameId;
        this._logger = this.gameInitialization.initializeLogger(this);
        this._players = this.gameInitialization.initializePlayers(this, playerIds);
        this._quitPlayers = [];
        this._score = gameInitialization.initializeScore(this);
        this._currentPlayerIndex = 0;
        this._currentRound = 0;
        this._gameStatus = this.GameStatus.ROUND_ENDED;

        [this._deck, this._jokerNumber, this._validationCards] = this.gameInitialization.initializeDeckJokerAndValidationCards();
        this._validationCards = this._deck.getCards().slice().sort()
        this._cardsToDraw = options.cardsToDraw as number; //its OK since initializeOptions sets these to numbers
        this._cardsToDrawDiscardPile = options.cardsToDrawDiscardPile as number;
        this._cardsToDeal = options.cardsToDeal as number;
    }


    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Getters/setters //////////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    get jokerNumber() {return this._jokerNumber;}
    get cardsToDraw() {return this._cardsToDraw;}
    get cardsToDrawDiscardPile() {return this._cardsToDrawDiscardPile;}
    get cardsToDeal() {return this._cardsToDeal;}

    get logger() {return this._logger;}
    get players() {return this._players;}
    get quitPlayers() {return this._quitPlayers;}
    get score() {return this._score;}
    get currentPlayerIndex() {return this._currentPlayerIndex;}
    get currentRound() {return this._currentRound;}
    get gameStatus() {return this._gameStatus;}
    get deck() {return this._deck;}
    get validationCards() {return this._validationCards;}



    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Validation functions ///////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    /** Validates that the cards in play tally with validationCards, and all melds are valid. */
    protected validateGameState(){
        if (!this.checkGameEnded() || !this.checkRoundEnded()) return false;

        //get deck and discard pile cards
        let checkCards: Card[] = [];
        checkCards.push(...this._deck.getCards());
        checkCards.push(...this._deck.getDiscardPile());

        //for each player, add their hand cards to checkCards; then validate each meld, then add the cards to checkCards
        for (const player of this._players){
            checkCards.push(...player.hand);
            for (const meld of player.melds){
                if (meld.cards && meld.checkAndSortMeld()) checkCards.push(...meld.cards);
                else { 
                    this._logger.logWarning('validateGameState', undefined, undefined, `Player ${player.id} has invalid meld: ${meld.cards}`);
                    this.setGameStatus(this.GameStatus.END_GAME);
                    return false;
                }
            }
        }

        //sort checkCards and compare with validationCards (as strings, since they don't reference the same card objects)
        checkCards.sort(Card.compareCardsSuitFirst);    
        if (JSON.stringify(checkCards) != JSON.stringify(this._validationCards)){
            this._logger.logWarning('validateGameState', undefined, undefined, 'Invalid game state'); 
            this.setGameStatus(this.GameStatus.END_GAME);
            return false;
        }
        return true;
    }


    /** Simply checks that the current _gameStatus is correct. */
    validateGameStatus(intended_GameStatus: keyof typeof this.GameStatus){
        if (intended_GameStatus !== this._gameStatus) return false;
        return true;
    }


    /**
     * Checks if the round has ended.
     * Normally only occurs when the current (playing) player runs out their hand, but variants may have different conditions.
     */
    protected checkRoundEnded(){
        if (this._players[this._currentPlayerIndex].hand.length==0 && this._players[this._currentPlayerIndex].playing){
            this.setGameStatus(this.GameStatus.ROUND_ENDED);
            this._logger.logGameAction(
                'checkRoundEnded', 
                undefined, 
                undefined, 
                `Current player ${this._players[this._currentPlayerIndex].id} has finished hand. Ending round`
                )
            return false;
        }
        return true;
    }
    
    
    /**
     * Checks if the game has ended.
     * Normally only occurs if <=1 player is left playing, but variants may have different conditions.
     */
    protected checkGameEnded(){
        let still_playing=0;
        for (const player of this._players){
            if (player.playing) still_playing++;
        }

        if (still_playing<=1){
            this._logger.logGameAction('checkGameEnded', undefined, undefined, '<=1 player left, ending game');
            this.setGameStatus(this.GameStatus.END_GAME);
            return false;
        }
        return true;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Game action functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    


    /** Setter for _gameStatus. */
    protected setGameStatus(_gameStatus: keyof typeof this.GameStatus){
        this._gameStatus = _gameStatus;
        return true;
    }


    /** 
     * Does some things necessary housekeeping to initiate next round.
     */
    protected nextRound(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.ROUND_ENDED)) return false;

        //calculate the round _score
         if (this._currentRound!=0) this._score.evaluateRoundScore();

        //increment round
        this._currentRound++;

        //moves just-quit _players to _quitPlayers, and just-unquit _players to _players
        for (const [index, player] of this._players.entries()){
            if (!player.playing) this._quitPlayers.push(...this._players.splice(index, 1));
        }
        for (const [index, player] of this._quitPlayers.entries()){
            if (player.playing) this._players.push(...this._quitPlayers.splice(index, 1));
        }
        
        //TO DO: some flag to set if any option was changed during a round
        //and reinitialize stuff
        //this.gameInitialization.initializeOptions(this.title, this._players.length);
        
        //deal cards
        for (const player of this._players){
            player.resetCards();
            player.addToHand(this._deck.draw(this._cardsToDeal));
        }

        //if it's the first round, deal extra card to first player + let them start
        if (this._currentRound===1){
            this._players[0].addToHand(this._deck.draw(1));
            this.setGameStatus(this.GameStatus.PLAYER_TURN);
        }   

        //else, find the previous winner and deal them extra card + let them start
        else{
            //TO DO: get last round winner
            this.setGameStatus(this.GameStatus.PLAYER_TO_DRAW);
        }

        this._logger.logNewRound();
        return true;
    }


    /** Goes to the next player. While the next player isn't playing, go to the next next player. */
    public nextPlayer(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN_ENDED)) return false;

        //while next player isn't playing, go to the next next player (modulo no. of _players, to loop back to first player)
        do {this._currentPlayerIndex = (this._currentPlayerIndex+1) % (this._players.length);}
        while (!this._players[(this._currentPlayerIndex+1) % (this._players.length)].playing)

        this.setGameStatus(this.GameStatus.PLAYER_TO_DRAW);
        return true;
    }


    /** Sets a player as having quit; keeps their cards in their possession for current round. */
    public quitPlayer(playerIndex=this._currentPlayerIndex){
        if (!this.validateGameState()) return false;

        if (playerIndex > this._players.length) return false;

        this._players[playerIndex].playing = false;
        if (this.checkGameEnded()) return true;
        if (this._currentPlayerIndex === playerIndex){
            this.setGameStatus(this.GameStatus.PLAYER_TURN_ENDED);
            this.nextPlayer();
        }
        this._logger.logGameAction('quitPlayer', this._players[playerIndex].id, {playerIndex}, undefined);
        return true;
    }


    /** Unquits a player who was playing; they will continue next round with their previous round _scores intaS. */
    public unquitPlayer(playerId: string){
        if (!this.validateGameState()) return false;

        for (const [index, player] of this._quitPlayers.entries()){
            if (player.id == playerId){
                let unquitter = this._quitPlayers.splice(index, 1);
                this._players.push(...unquitter);
                this._logger.logGameAction('unquitPlayer', playerId, {playerId}, undefined);
                return true;
            }
        }
        return false;
    }


    /** Adds a new player to the game. */
    public addPlayer(playerId: string){
        if (!this.validateGameState()) return;
        this._players.push(new Player(this, playerId));
        this._logger.logGameAction('addPlayer', playerId, {playerId}, undefined); 
    }


    //Forces ending the game
    //TO DO
    public forceEndGame(){

    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////// Player action functions (acts on current player) /////////////
    ////////////////////////////////////////////////////////////////////////////

    
    
    /** Sorts a player's hand, by suit THEN by number. */
    //TO DO: this is broken (probably the comparison function), plz fix
    public sortHandBySuit(playerIndex = this._currentPlayerIndex){
        if (!this.validateGameState()) return false;

        this._players[playerIndex].hand.sort((a, b) => {
            if (a.number == this._jokerNumber && b.number == this._jokerNumber) return Card.compareCardsSuitFirst(a, b);
            if (a.number == this._jokerNumber) return 1;
            if (b.number == this._jokerNumber) return -1;
            return Card.compareCardsSuitFirst(a, b);
        })

        this._logger.logGameAction('sortHandBySuit', this._players[playerIndex].id, undefined, undefined);
        return true;
    }


    /** Sorts a player's hand, by number THEN by suit. Defaults to current _players. */
    public sortHandByNumber(playerIndex = this._currentPlayerIndex){
        if (!this.validateGameState()) return false;

        this._players[playerIndex].hand.sort((a, b) => {
            if (a.number == this._jokerNumber && b.number == this._jokerNumber) return Card.compareCardsNumberFirst(a, b);
            if (a.number == this._jokerNumber) return 1;
            if (b.number == this._jokerNumber) return -1;
            return Card.compareCardsNumberFirst(a, b);
        })

        this._logger.logGameAction('sortHandByNumber', this._players[playerIndex].id, undefined, undefined);
        return true;
    }


    /** Draws `_cardsToDraw` cards from the deck, for the current player. */
    public drawFromDeck(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        let drawnCards = this._deck.draw(this._cardsToDraw);
        this._players[this._currentPlayerIndex].hand.push(...drawnCards);

        this._logger.logGameAction('drawFromDeck', this._players[this._currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`); 
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    /**
     * Draws '_cardsToDrawDiscardPile' cards from the discard pile, for the current player.
     * If insufficient cards in discard pile, returns false.
     */
    public drawFromDiscardPile(){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TO_DRAW)) return false;

        //if there's no discard pile, return false
        let drawnCards: Card[];
        let discardSize = this._deck.getDiscardPileSize();
        if (discardSize==0) return false;
        
        //if "all", draw the entire discard pile
        if (this._cardsToDrawDiscardPile=="all"){
            drawnCards = this._deck.drawFromDiscardPile(this._deck.getDiscardPileSize());
        }

        //else check if discardPile size < than draw amount. if so, return false; else draw the cards
        else{
            if (this._deck.getDiscardPileSize() < this._cardsToDrawDiscardPile) return false;
            drawnCards = this._deck.drawFromDiscardPile(this._cardsToDrawDiscardPile);       
        }
        
        //add drawnCards to player hand and return
        this._players[this._currentPlayerIndex].hand.push(...drawnCards);
        this._logger.logGameAction('drawFromDiscardPile', this._players[this._currentPlayerIndex].id, undefined, `Card drawn: ${drawnCards}`);
        this.setGameStatus(this.GameStatus.PLAYER_TURN);
        return true;
    }


    /** Attempts to create a meld out of chosen cards in the current player's hand. */
    public createMeld(indexArr: number[]){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        //ensure all indexes are all unique
        let uniqueIndexArr = Array.from(new Set(indexArr));

        //get copy of player's hand, to copy back if meld is invalid
        let playerHand = this._players[this._currentPlayerIndex].hand;

        //check if each index is valid, then add the corresponding card to meldCards
        let meldCards = [];
        for (const index of uniqueIndexArr){
            if (index < this._players[this._currentPlayerIndex].hand.length){
                this._logger.logWarning('createMeld', this._players[this._currentPlayerIndex].id, {uniqueIndexArr}, 'Invalid index array');
                return false;
            }
            else meldCards.push(playerHand[index]);
        }

        //if meld is valid, create the Meld object and add it to player's melds + draw the cards from player's hand 
        if (validateAndSortMeld(meldCards, this._jokerNumber)){
            let newMeld = new Meld(meldCards, this._jokerNumber);
            this._players[this._currentPlayerIndex].addMeld(newMeld);
            this._players[this._currentPlayerIndex].drawFromHand(uniqueIndexArr)
            this._logger.logGameAction('createMeld', this._players[this._currentPlayerIndex].id, {uniqueIndexArr});
            return true;
        }

        //else, call the forfeit function and return false 
        else{
            this.invalidMeldDeclaration();
            this._logger.logWarning('createMeld', this._players[this._currentPlayerIndex].id, {uniqueIndexArr}, 'Invalid meld');
            return false;
        }
    }


    /**
     * Creates a forfeit for the current player if they declared an invalid meld, since some Rummy variants have such a rule.
     * Called automatically by createMeld in the case of invalid meld.
     * Doesn't do anything currently, but can be overridden if needed.
     */
    public invalidMeldDeclaration(){
        return;
    }


    /**  Attempts to add a specified card in current player's hand, to a specified meld, of a specified player. */
    public addToMeld(addingCardIndex: number, meldOwnerIndex: number, meldIndex: number){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return;

        if (addingCardIndex >= this._players[this._currentPlayerIndex].hand.length ||
            meldOwnerIndex >= this._players.length ||
            meldIndex >= this._players[meldOwnerIndex].melds.length) 
            return false;

        let potentialMeld = this._players[meldOwnerIndex].melds[meldIndex];
        let addingCard = this._players[this._currentPlayerIndex].hand[addingCardIndex];

        if (potentialMeld.addCard(addingCard)){
            this._players[meldOwnerIndex].melds[meldIndex] = potentialMeld;
            this._players[this._currentPlayerIndex].hand.splice(addingCardIndex, 1);

            this._logger.logGameAction('addToMeld', this._players[this._currentPlayerIndex].id, {addingCardIndex, meldOwnerIndex, meldIndex});
            return true;
        }

        else{
            this._logger.logWarning(
                'addToMeld',
                this._players[this._currentPlayerIndex].id,
                {addingCardIndex, meldOwnerIndex, meldIndex},
                'Invalid meld addition'
                );
            return false;
        }
    }


    /** Attempts to replace a specified card (only jokers?) in a specified meld, with a specified card in current player's hand. */
    public replaceMeldCard(
        replacingCardIndex: number, 
        meldOwnerIndex: number, 
        meldIndex: number, 
        replacedCardIndex: number) {
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return;

        if (replacingCardIndex >= this._players[this._currentPlayerIndex].hand.length ||
            meldOwnerIndex >= this._players.length ||
            meldIndex >= this._players[meldOwnerIndex].melds.length ||
            replacedCardIndex >= this._players[meldOwnerIndex].melds[meldIndex].cards.length) 
            return false;

        let potentialMeld = this._players[meldOwnerIndex].melds[meldIndex];
        let replacingCard = this._players[this._currentPlayerIndex].hand[replacingCardIndex];
        let replacedCard = potentialMeld.replaceCard(replacingCard, replacedCardIndex);

        if (replacedCard){
            this._players[meldOwnerIndex].melds[meldIndex] = potentialMeld;
            this._players[this._currentPlayerIndex].hand.splice(replacingCardIndex, 1);
            this._players[this._currentPlayerIndex].addToHand([replacedCard]);

            this._logger.logGameAction(
                'replaceMeldCard',
                this._players[this._currentPlayerIndex].id,
                {replacingCardIndex, meldOwnerIndex, meldIndex, replacedCardIndex}
                );
            return true;
        }

        else{
            this._logger.logWarning(
                'replaceMeldCard',
                this._players[this._currentPlayerIndex].id,
                {replacingCardIndex, meldOwnerIndex, meldIndex, replacedCardIndex},
                'Invalid card replacement'
            );
            return false;
        }
    }

    
    /** End current player's turn, and choose a card in hand to discard. */
    public endTurn(cardIndex: number){
        if (!this.validateGameState() || !this.validateGameStatus(this.GameStatus.PLAYER_TURN)) return false;

        if (cardIndex >= this._players[this._currentPlayerIndex].hand.length || isNaN(cardIndex)){
            this._logger.logWarning('endTurn', this._players[this._currentPlayerIndex].id, {cardIndex}, undefined);
            return false;
        }

        let discardedCard = this._players[this._currentPlayerIndex].hand.splice(cardIndex, 1)[0];
        this._deck.addToDiscardPile(discardedCard);
        this._logger.logGameAction('endTurn', this._players[this._currentPlayerIndex].id, {cardIndex}, undefined);
        this.setGameStatus(this.GameStatus.PLAYER_TURN_ENDED);
        return true;
    }



    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Viewing functions ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////



    /** Returns an object with information useful for a specified player (defaults to current player). */
    public getGameInfoForPlayer(playerIndex = this._currentPlayerIndex){

        let gameInfo: ExternalGameInfo = 
        {
            jokerNumber: this._jokerNumber,
            deckSize: this._deck.remaining(),
            topDiscardCard: this._deck.getTopOfDiscardPile(),
            discardPileSize: this._deck.getDiscardPileSize(),

            currentPlayer: {
                id: this._players[playerIndex].id,
                hand: this._players[playerIndex].hand,
                melds: this._players[playerIndex].melds
            },

            tableMelds: this._players.reduce((acc: {[playerId: string]: Meld[]}, player) => {
                acc[player.id] = player.melds;
                return acc;
            }, {})
        };

        return gameInfo;
    }
}