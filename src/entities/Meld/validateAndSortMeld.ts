import { Card } from "../PokerDeck/Card";
import { numbers } from "../PokerDeck/suitsNumbers";


//Auxiliary functions for checking and sorting a meld. These are mostly used in the Meld class.


/** Validates an array of cards as a meld, and sorts the cards into the valid meld in-place. */
export function validateAndSortMeld(cards: Card[], jokerNumber: (keyof typeof numbers|0)=0, maxSetSize: number=4) {
  if (Array.isArray(cards) && cards.length>=3 && (isValidSequence(cards, jokerNumber) || isValidSet(cards, jokerNumber, maxSetSize))) {
    return true;
  } else {
    return false;
  }
}



/**
 * Checks if an array of cards forms a valid sequence, ie adjacent numbers and same suits.
 * If valid, sorts the array to form the sequence before returning.
 */
function isValidSequence(cards: Card[], jokerNumber: (keyof typeof numbers|0)=0) {
  //filter out jokers and sort the cards
  let jokers = [];
  let jokerlessCards = cards;
  let sortedCards = jokerlessCards;
  if (jokerNumber!=0) [jokerlessCards, jokers] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  let isValid = true;
  let sortedOffset = 0;
  
  /*
  Check adjacent cards for same suit and adjacent number; while not the case, slot in a joker.
  Whenever we slot in a joker, increment sortedOffset and use it to offset i in the future,
  so that we aren't checking inserted jokers.
  */
  for (let i=0; i+sortedOffset<sortedCards.length; i++){
    if (i==0) continue;

    const currentCardValue = jokerlessCards[i+sortedOffset].cardValueSuitFirst();
    const prevCardValue = jokerlessCards[i+sortedOffset-1].cardValueSuitFirst();
    let difference = currentCardValue - prevCardValue;

    //when we slot in a joker, offset the index in sortedCards by +1
    while (difference>1 && jokers.length>0){
      difference--;
      sortedCards.splice(i+sortedOffset, 0, jokers.splice(0, 1)[0]);
      sortedOffset++;
    }

    //if a gap can't be filled by jokers, cards don't form a valid sequence
    if (jokers.length<=0 && difference>1){
      isValid = false;
      break;
    }
  }

  //if its a valid sequence, replace the cards with sortedCards
  if (isValid) cards = sortedCards;
  return isValid;
}


/**
 * Checks if an array of cards forms a valid set, ie all same numbers.
 * If valid, sorts the array to form the set before returning.
 */
function isValidSet(cards: Card[], jokerNumber: (keyof typeof numbers|0)=0, maxSetSize: number=4) {
  //filter out jokers and sort the cards
  let jokers = [];
  let jokerlessCards = cards;
  if (jokerNumber!=0) [jokerlessCards, jokers] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  //check that each non-joker card's number is the same
  let isValid = true;
  for (let i = 0; i < jokerlessCards.length; i++) {
    if (jokerlessCards[i].number != jokerlessCards[0].number) isValid = false;
  }

  //check that the set doesn't exceed max size
  if (isValid && jokerlessCards.length+jokers.length>maxSetSize) isValid = false;

  //if it's a valid set, sort the meld (move jokers to back of array)
  if (isValid) cards = jokerlessCards.concat(jokers);
  return isValid;
}


//Filters and counts jokers from an input array of cards, and returns joker count + filtered cards
function filterJokers(cards: Card[], jokerNumber: (keyof typeof numbers|0)=0){
  let jokers=[];
  let jokerlessCards = [];

  if (jokerNumber!=0){
    jokerlessCards = cards.filter(card => {
      if (card.number==jokerNumber) {
        jokers.concat(card);
        return false;
      }
      return true;
    } 
    )
  }

  jokerlessCards.sort(Card.compareCardsNumberFirst);
  return [jokerlessCards, jokers];
}
