# rummyJS

rummyJS is a package for modelling a game of Rummy, and its variants. It's fairly comprehensive, featuring:
- Standard player moves
- Mid-game player additions/removals
- Gamestate validation
- Strict game flow
- Scorekeeping
- Error and game/player action logging
    
It's also extensible, as variants can be created by extending base classes as necessary.

## Installing and instantiating a game

WIP

## Game flow

Game flow is managed with the `gameStatus` property, which are set to symbols defined in `GameStatus`. 

It controls which actions can be taken, and is modified within certain functions to follow the typical Rummy game flow. For example, `endTurn()` will modify it to `PLAYER_TO_DRAW`, as it signifies that the next action should be a player drawing cards; other gamestate-modifying actions will be blocked.

Here is a chart describing the game flow:

WIP

## Creating Rummy variants

WIP
