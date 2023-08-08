import { isMeld } from "../entities/Meld/isMeld.js";
import { Meld } from "../entities/Meld/Meld.js";
import { Card } from "../entities/PokerDeck/Card.js";

let arr = []
arr.push(new Card("Clubs", "Ace"))
arr.push(new Card("Hearts", "Ace"))
arr.push(new Card("Hearts", "2"))
let meld = new Meld(arr, 2)

let arr2 = []
arr2.push(new Card("Clubs", "8"))
arr2.push(new Card("Clubs", "9"))
arr2.push(new Card("Clubs", "10"))
let meld2 = new Meld(arr2, 2)

console.log(`${meld}, ${meld2}`)