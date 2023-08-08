import { Card } from "../PokerDeck/Card.js";

/*
Main function for checking validity of a meld, by checking if it's a sequence or set.
Accepts an array of cards, cards, optional joker number, jokerNumber, and optional max set size (defaults to 4).
Outputs a true/false.
*/
export function isMeld(cards, jokerNumber=0, maxSetSize=4) {

    if (Array.isArray(cards) && cards.length>=3 && (isValidSequence(cards, jokerNumber) || isValidSet(cards, jokerNumber, maxSetSize))) {
      return true;
    } else {
      return false;
    }
  }


/* 
Check if the cards form a valid sequence.
Accepts the array of cards and an optional jokerNumber.
Checks for validity by:
  -Call filterJokers() to filter & count jokers
  -Sort the cards
  -Loop over the cards:
    -If a card is not sequenced with the previous card (difference>1), use a joker card to fill the difference.
    -If, at any point, we can't fill the difference up to 1 with jokers, return false.
    -Else, return true.

  -Return the result of the loop, as true/false.
*/
function isValidSequence(cards, jokerNumber=0) {
  let jokerCount=0;
  let jokerlessCards=cards;
  if (jokerNumber!=0) [jokerlessCards, jokerCount] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  let isValid = true;

  for (let i=0; i<jokerlessCards.length; i++){
    if (i==0) continue;

    const currentCardValue = jokerlessCards[i].cardValueSuitFirst();
    const prevCardValue = jokerlessCards[i-1].cardValueSuitFirst();
    let difference = currentCardValue - prevCardValue;

    while (difference>1 && jokerCount>0){
      difference--;
      jokerCount--;
    }
    if (jokerCount<=0 && difference>1){
      isValid = false;
      break;
    }
  }
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
function isValidSet(cards, jokerNumber=0, maxSetSize=4) {
  let jokerCount=0;
  let jokerlessCards=cards;
  if (jokerNumber!=0) [jokerlessCards, jokerCount] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  //Check that each card's number is correct
  let isValid = true;
  for (let i = 0; i < jokerlessCards.length; i++) {
    if (jokerlessCards[i].number != jokerlessCards[0].number) isValid = false;
  }

  if (isValid && jokerlessCards.length+jokerCount>maxSetSize) isValid = false;
  return isValid;
}



//Filters and counts jokers from an input array of cards, and returns joker count + filtered cards
function filterJokers(cards, jokerNumber){
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
  jokerlessCards.sort(Card.compareCards);
  return [jokerlessCards, jokerCount];
}
