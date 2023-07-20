
import {suits, numbers} from "../PokerDeck/suitsNumbers.js";


/*
Main function for checking validity of a meld, by checking if it's a sequence or set.
Accepts an array of cards, cards, and an optional joker number, jokerNumber.
Outputs a true/false.
*/
export function isMeld(cards, jokerNumber=0) {

    if ((isValidSequence(cards, jokerNumber) || isValidSet(cards, jokerNumber)) && cards.length>=3) {
      return true;
    } else {
      return false;
    }
  }


/* 
Check if the cards form a valid sequence.
Accepts the array of cards and an optional jokerNumber.
Checks for validity by:
  -Call filterJokers() to filter & count jokers, and sort the cards.
  -Loop over the cards:
    -If a card is not sequenced with the previous card (difference>1), use a joker card to fill the difference.
    -If, at any point, we can't fill the difference up to 1 with jokers, return false.
    -Else, return true.

  -Return the result of the loop, as true/false.
*/
function isValidSequence(cards, jokerNumber=0) {
  let jokerCount=0;
  let jokerlessCards;
  if (jokerNumber!=0) [jokerlessCards, jokerCount] = filterJokers(cards);

  const isValid = jokerlessCards.every((card, index) => {
    if (index==0) return true;

    const currentCardValue = cardValue(card);
    const previousCardValue = cardValue(jokerlessCards[index-1]);
    const difference = currentCardValue - previousCardValue;

    while (difference>1 && jokerCount>0){
      difference--; jokerCount--;
      if (jokerCount<=0 && difference>1) return false;  
    }
    return true;
  })
  return isValid;
}


/* 
Check if the cards form a valid set.
Accepts an array of cards and an option jokerNumber.
Checks for validity by:
  -Counting number of instances of each card number.
  -Check that the count of every card number + number of jokers is 3 or 4.
  -Returns true if so; else false.
*/
function isValidSet(cards, jokerNumber=0) {
  let jokerCount=0;
  let jokerlessCards=cards;
  if (jokerNumber!=0) [jokerlessCards, jokerCount] = filterJokers(cards);

  // Count the occurrences of each card number
  const cardCounts = {};
  for (let i = 0; i < cards.length; i++) {
    const card = jokerlessCards[i];
    const number = card.number;
    cardCounts[number] = cardCounts[number] ? cardCounts[number] + 1 : 1;
  }

  // Check if all card counts are 3 or 4
  const counts = Object.values(cardCounts);
  return counts.every((count) => count+jokerCount === 3 || count+jokerCount === 4);
}


/*
Filters and counts jokers from an input array of cards, and sorts before returning them.
*/
function filterJokers(cards){
  let jokerCount=0;
  let jokerlessCards = [];

  if (jokerNumber!=0){
    jokerlessCards = cards.filter(card => {
      if (card.number==jokerNumber) {
        jokerCount++;
        return false;
      }
      return true;
    } 
    )
  }
  jokerlessCards.sort((a, b) => cardValue(a) - cardValue(b));
  return [jokerlessCards, jokerCount];
}


/*
Returns value of a card.
Each number in the same suit is subsequent, for checking sequences.
For checking sets, simply checking the number property is enough.
*/
function cardValue(card){
  return suits[card.suit]*100 + numbers[card.number];
}
