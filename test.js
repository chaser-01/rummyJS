import { PokerDeck } from "./src/entities/PokerDeck/PokerDeck.js";

let deck = new PokerDeck();
deck.addToDiscardPile(deck.draw(51))
let x = deck.draw(5)
console.log(deck)
console.log(x)