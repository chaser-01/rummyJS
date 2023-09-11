# rummyTS
**Warning!** This library is currently under heavy development. The API is unstable and may change at any moment without prior notice. Use at your own risk.

A unit-tested library for modelling a game of Rummy. It features:
- Standard player moves
- Mid-game player additions/removals
- Gamestate validation
- Strict game flow
- Scorekeeping
- Error and game/player action logging

## Installing
```
npm install rummyts
```

## Usage
Import the necessary classes:
```
import {Game} from 'rummyts';
```

### Game
Instantiate a `Game` by passing in an array of strings to represent players:
```
//default instantiation
let game = new Game(['1', '2', '3']);
```

Optionally, pass in options to customize a few aspects of the game:
```
//the possible options and their default values
let game = new Game(['1', '2', '3'], {
    useWildcard: false,
    useJoker: true,
    cardsToDraw: 1,
    cardsToDrawDiscardPile: 1, //can also set to "all"
    cardsToDeal: 10, 
    numberOfDecks: 1 
})
```

We use the game's `gameStatus` property to track the current status. 

The game initializes in `ROUND_ENDED`, so call `.nextRound` to enter round 1:
```
game.nextRound();
```

#### PLAYER_TO_DRAW
At the start of each turn, the current player can **draw from the deck** with `.drawFromDeck`, or **draw from the discard pile** with `.drawFromDiscardPile`:
```
//automatically assigns *cardsToDraw* cards to current player's hand
game.drawFromDeck();

//OR

//only works if discard pile's size is greater than/equal to *cardsToDrawDiscardPile*
game.drawFromDiscardPile();
```

#### PLAYER_TURN
Here, the current player can make any number of (valid) moves. 

To get **important information for the current player**, we can call `.getGameInfoForPlayer`:
```
let info = game.getGameInfoForPlayer();
console.log(info);
/*
{
    jokerNumber: "Joker",
    deckSize: 33,
    topDiscardCard: undefined,
    discardPileSize: 0,

    currentPlayer: {
        id: '1',
        hand: //the current player's hand
    }

    tableMelds: {
        '1': [ //player 1's melds ],
        '2': [ //player 2's melds ],
        ...
    }
}
*/
```

We can also **directly access each player's hand** (though don't show this information to other players, since that would be unfair):
```
let firstPlayerHand = game.players[0].hand;
```

The current player can then perform moves, such as **create a meld**:
```
//♥A, ♦A, ♥4, ♣A
let hand = game.players[game.currentPlayerIndex].hand; 

//pass in indexes of the cards used to form a meld
game.createMeld([0, 1, 3]); 

//[[♥A, ♦A, ♥4, ♣A]]
let melds = game.players[game.currentPlayerIndex].melds; 
```

**Add to** any meld:
```
//♥2, ♣7, ♦9
let hand = game.players[game.currentPlayerIndex].hand; 

//[[♥3, ♥4, ♥5]]
let player2Meld = game.getGameInfoForPlayer().tableMelds[1]; 

//add card 0 (♥2) to player 1 -> meld 0
game.addToMeld(0, 1, 0);

//[[♥2, ♥3, ♥4, ♥5]]
player2Meld = game.getGameInfoForPlayer().tableMelds[1]; 

//♣7, ♦9
hand = game.players[game.currentPlayerIndex].hand; 
```

Or **replace** a meld's joker/wildcard (if applicable):
```
//current player hand: ♥6, ♣7, ♦9
let hand = game.players[game.currentPlayerIndex].hand; 

//player 1's melds: [[Joker, ♥3, ♥4, ♥5]]
let player2Meld = game.getGameInfoForPlayer().tableMelds[1]; 

//use current player's card 0, to replace player 1 -> meld 0 -> card 3
game.replaceMeldCard(0, 1, 0, 3);

//[[♥3, ♥4, ♥5, ♥6]]
player2Meld = game.getGameInfoForPlayer().tableMelds[1]; 

//Joker, ♣7, ♦9
hand = game.players[game.currentPlayerIndex].hand; 
```

If an **invalid move** is attempted, it will not go through:
```
//current player hand: ♥6, ♣7, ♦9
let hand = game.players[game.currentPlayerIndex].hand; 

//meld is not created
game.createMeld([0, 1, 2]);
```

When they're done, call `.endTurn` and specify a card index to discard:
```
game.endTurn(0); //discards card 0
```

This increments the current player, and sets the status to `PLAYER_TO_DRAW`.

#### ROUND_ENDED
When a player has ran out their hand, they have won, and the round is finished. To go to the next round, call `.nextRound` again. The winner of the current round will start next round.

#### END_GAME
The below conditions will cause the game to end:
- 0/1 players are left
- `.forceEndGame` was called
- `.validateGameState` returns false (internally called before any state-modifying function; checks gamestate for validity)

#### Status-independent
Some actions can be taken in any status except for `END_GAME` (mostly administrative actions).

Any player can sort their hand at any time:
```
//Joker, ♥5, ♥4, ♥3, ♠3
let player2Hand = game.players[2].hand;

//sorts player 2's hand by suit, then number; jokers at the end
game.sortHand(2); 

//♥3, ♠3, ♥4, ♥5, Joker
let player2HandSorted = game.players[2].hand;
```

A **new player** can be added (optionally at a specific index):
```
game.addPlayer('Ricky', 0); //adds new player Ricky at index 0
```

A player can **quit**; they retain their cards till end of round, and their scores are calculated for the round: 
```
game.quitPlayer(0); //quits the player at index 0, ie Ricky
```

A previously-quit player can unquit, to continue off their previous round's scores. They will continue playing next round:
```
game.unquitPlayer('Ricky');
```

A game can be forcibly ended:
```
game.forceEndGame();
```  

### Score
At the end of each round, each player's score (including players who quit that round) is calculated. Currently, this is simply the direct value of their hand card's numbers.  

To access the score object, use `.score`:
```
let score = game.score;
```

Each round's score is an array of [Player, score]:
```
let round1 = score[1]; //[['1', 10], ['2', 24], ['3', 0]]
```

### Logger
`Game` contains a logger object that tracks all gamestate-modifying actions and invalid actions within a game.  

To access the logger, use `.logger`:
```
let logger = game.logger;
```

The logger has 2 logs, `.warningLog` and `.actionLog`. Previous and current rounds can be accessed through each log:
```
logger.warningLog[1]; //warning log for round 1
logger.actionLog[1]; //action log for round 1
```

A log for a round is an array of logs. Each log has the calling `functionName`, involved player's `playerId` (defaults to GAME if none provided), the function's `args`, and optional `notes`:
```
logger.warningLog[1][0];
/*
{
    functionName: 'createMeld',
    playerId: '1',
    args: {indexArr: [0, 1, 10000]},
    notes: 'Invalid index array'
}
*/
```

WIP: To write out a log to json, use `.writeOutWarningLog` or `.writeOutActionLog`. You can pass in a `directory` to write to, and an optional `round` if you only want to write out a specific round:
```
logger.writeOutWarningLog('./warnings', 1); //writes out round 1 of warningLog to warnings directory
```



