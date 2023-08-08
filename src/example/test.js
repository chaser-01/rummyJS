import { isMeld } from "../entities/Meld/isMeld.js";
import { Card } from "../entities/PokerDeck/Card.js";

let arr = []
arr.push(new Card("Clubs", "Ace"))
arr.push(new Card("Hearts", "Ace"))
arr.push(new Card("Hearts", "2"))
arr.push(new Card("Spades", "2"))

let arr2 = []
arr2.push(new Card("Clubs", "8"))
arr2.push(new Card("Clubs", "9"))
arr2.push(new Card("Clubs", "10"))

console.log(isMeld(arr, 2))
console.log(isMeld(arr2, 2))