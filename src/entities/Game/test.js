import { Game } from "./Game.js";


let game = new Game([1, 2, 3, 4])

//console.log(game.gameStatus)
game.nextRound()

console.log(game.getGameInfoForPlayer().currentPlayer)
game.sortHandByNumber()
console.log(game.getGameInfoForPlayer().currentPlayer)
game.nextRound()