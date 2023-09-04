import { Card } from "../PokerDeck/Card";
import { Meld } from "./Meld";

let cards = [
    new Card("Hearts", "Ace"),
    new Card("Joker", "Joker"),
    new Card("Hearts", "Three")
]

let meld = new Meld(cards, "Joker");
let replacingCard = new Card("Hearts", "Two");
console.log(meld.replaceCard(replacingCard, 1))
console.log(cards[1])