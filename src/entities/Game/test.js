import { Game } from "./Game.js";
import { loadConfigFile } from "./loadConfig.js";

let a = 0

if (!a) {
    let game = new Game([1, 2, 3, 4])
}

if (a) {
    let x = loadConfigFile('rummy').cardsToDraw.decks

    for (const deck in x){
        let y = x[deck]
        console.log(`for ${deck} deck(s), draw ${y.players[4]} cards`)
    }
}