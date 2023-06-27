export class GameTurn{
    constructor(players, currentPlayerIndex, deck, discardPile, jokerNumber){
        this._players = players;
        this._currentPlayerIndex = currentPlayerIndex;
        this._deck = deck;
        this._discardPile = discardPile;
        this._jokerNumber = jokerNumber;
        this.movesTaken = [];
    }

    startTurn(){
        /*
        TO DO:
        this indicates start of the turn
        some way of ending the turn from here? so that next turn can occur
        */
    }

    viewTableMelds(){
        let melds = {};
        for (const player of this._players){
            melds[player.getId()] = player.getMelds();
        }
        return melds;
    }

    viewTableHands(){
        let hands = {};
        for (const player of this._players){
            hands[player.getId()] = player.getHand();
        }
        return hands;
    }


    /*
    Player Actions
    Note: These assume that the current player is calling; still checks to ensure any moves made are valid.
    */
    drawFromDeck(){
        //TO DO
    }

    drawFromDiscardPile(){
        //TO DO: draw one/all of (??) the cards from the discard pile
    }

    discardCard(card){

    }

    makeMeld(cards){
        
    }

    addToMeld(card){
        
    }

    replaceJokerInMeld(card){
        //  
    }

    endTurn(){
        //TO DO: some way to signal back to Round that turn has ended; perhaps returned from startTurn or something
        //not sure if necessary, its automatic from discardCard anyway
    }
}