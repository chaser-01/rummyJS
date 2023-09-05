# rummyJS

rummyJS is a package for modelling a game of Rummy, and its variants. Its features target realistic use cases, including:
- Standard player moves
- Mid-game player additions/removals
- Gamestate validation
- Strict game flow
- Scorekeeping
- Error and game/player action logging
    
It's also extensible, as variants can be created by extending base classes as necessary.

## Instantiating a game
WIP

## Game flow
The `gameStatus` property controls what actions can at a point in time in the game. Thus, one should compare it against possible states (defined in `GameStatus`), when tracking the game and determining what actions should be taken by the game/players. 

Below are the defined states and their allowed actions:

#### ROUND_ENDED 
In between rounds. The game initializes into this state.
- ***nextRound*** - Evaluates previous round's scores (if not the first round), removes quit players and adds new players, and goes to the next round.

#### PLAYER_TO_DRAW
The start of a player's turn.
- ***drawFromDeck*** - Draws *cardsToDraw* cards from the deck for the current player.  
- ***drawFromDiscardPile*** - Draws *cardsToDrawDiscardPile* cards from the discard pile for the current player.

#### PLAYER_TURN
In the middle of a player's turn.
- ***createMeld*** - Attempt to create a meld out of specified cards in the current player's hand, and assign to the current player's melds.
- ***addToMeld*** - Attempt to add a card from the current player's hand to any meld.
- ***replaceMeldCard*** - Attempt to replace any meld's card (typically a joker) with a card from the current player's hand.

#### PLAYER_TURN_ENDED
The end of a player's turn. Actions are:
- ***nextPlayer*** - Go to the next player (who is playing).

#### END_GAME
The end of a game. No actions can be taken in this state.

#### Any state
Some game actions can be taken regardless of the current state (excluding END_GAME):
- ***sortHandBySuit*** - Sorts a player's hand by suit, then number.  
- ***sortHandByNumber*** - Sorts a player's hand by number, then suit.  
- ***quitPlayer*** - Sets a player as having quit.  
- ***unquitPlayer*** - Sets a previously quit player as playing again (so they may keep their previous round scores).  
- ***addPlayer*** - Adds a new player to the game.  
- ***forceEndGame*** - Forces the end of the game.  


## Creating Rummy variants

WIP
