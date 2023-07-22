# rummyJS

rummyJS is a package for modelling a game of Rummy, and its variants. Its features target realistic use cases, including:
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

Game flow is managed with the `gameStatus` property, which are set to symbols defined in `GameStatus`. Gamestate-modifying actions are validated against the current `gameStatus` before being allowed to run.

Here is a chart describing the game flow:

WIP

## Creating Rummy variants

WIP
