import { isMeld } from "../entities/Meld/isMeld.js";
import { Meld } from "../entities/Meld/Meld.js";
import { Card } from "../entities/PokerDeck/Card.js";

let arr = []
arr.push(new Card("Clubs", "Ace"))
arr.push(new Card("Hearts", "Ace"))
arr.push(new Card("Hearts", "2"))
let meld = new Meld(arr, 2)

console.log(`${meld}`)

meld.replaceCard(new Card("Spades", "Ace"), 2, "2");
meld.addCard(new Card("Diamonds", "Ace"))
console.log(`${meld}`)