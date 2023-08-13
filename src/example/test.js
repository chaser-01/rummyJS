
import { Meld } from "../entities/Meld/Meld.js";
import { Card } from "../entities/PokerDeck/Card.js";

let arr = []
arr.push(new Card("Hearts", "Ace"))
arr.push(new Card("Spades", "2"))
arr.push(new Card("Hearts", "3"))
arr.push(new Card("Hearts", "4"))



let meld = new Meld(arr, '2')

console.log(`${meld}`)
