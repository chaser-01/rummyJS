import { validateAndSortMeld } from "./validateAndSortMeld";
import { Card } from "../PokerDeck/Card";
import { Meld } from "./Meld";

let cards = [ 
    new Card("Clubs", "Two"),
    new Card("Clubs", "Three"),
    new Card("Clubs", "Four"),
    new Card("Clubs", "Five"),
    new Card("Clubs", "Seven"),
    new Card("Clubs", "Eight"),
    new Card("Clubs", "Nine"),
    new Card("Clubs", "Ten")
]
let cardsWithJoker = [...cards]
cardsWithJoker.splice(4, 0, new Card("Joker", "Joker"));
console.log(cardsWithJoker)

let meld = new Meld(cardsWithJoker, "Joker");
console.log(meld.cards)