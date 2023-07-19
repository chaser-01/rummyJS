import { PokerDeck } from "./src/entities/PokerDeck/PokerDeck.js";

let deck = new PokerDeck();
console.log(deck)

let x = deck.draw(51)
deck.addToDiscardPile(x)
deck.draw(3)

