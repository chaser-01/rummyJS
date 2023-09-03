import { Card } from "../PokerDeck/Card";
import { numbers } from "../PokerDeck/suitsNumbers";


/*
Auxiliary function for checking and sorting a meld.
This isn't tested since it is directly (and only?) used in Meld anyway.
*/


/** Validates an array of cards as a meld, and sorts the cards into the valid meld in-place. */
export function validateAndSortMeld(cards: Card[], jokerNumber: (keyof typeof numbers|false)=false, maxSetSize: number=4) {
  if (cards.length>=3 && (checkForAndSortAsSequence(cards, jokerNumber) || checkForAndSortAsSet(cards, jokerNumber, maxSetSize))) {
    return true;
  } 
  else {
    return false;
  }
}


/**
 * Checks if an array of cards forms a valid sequence, ie adjacent numbers and same suits.
 * If valid, sorts the cards to form the sequence before returning.
 */
function checkForAndSortAsSequence(cards: Card[], jokerNumber: (keyof typeof numbers|false)=false) {
  //filter out jokers and sort the cards
  let jokers: Card[] = [];
  let sortedCards: Card[] = [];
  if (jokerNumber!=false) [sortedCards, jokers] = filterJokers(cards, jokerNumber);
  sortedCards.sort(Card.compareCardsNumberFirst);

  let isValid = true;
  let sortedOffset = 0;
  
  /*
  Check adjacent cards for same suit and adjacent number; while not the case, slot in a joker.
  Whenever we slot in a joker, increment sortedOffset and use it to offset i in the future,
  so that we aren't checking inserted jokers.
  */
  for (let i=1; i+sortedOffset<sortedCards.length; i++){
    const currentCardValue = sortedCards[i+sortedOffset].cardValueSuitFirst();
    const prevCardValue = sortedCards[i+sortedOffset-1].cardValueSuitFirst();
    let difference = currentCardValue - prevCardValue;

    //console.log(`${difference}, ${sortedCards[i+sortedOffset]} and ${sortedCards[i+sortedOffset-1]}`)

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

  //if its a valid sequence, replace the cards with sortedCards and concatenate any remaining jokers
  if (isValid) {
    cards = sortedCards;
    if (jokers.length>0) cards.push(...jokers);
  }

  return isValid;
}


/**
 * Checks if an array of cards forms a valid set, ie all same numbers.
 * If valid, sorts the array to form the set before returning.
 */
function checkForAndSortAsSet(cards: Card[], jokerNumber: (keyof typeof numbers|false)=false, maxSetSize: number=4) {
  if (cards.length<3 || cards.length>maxSetSize) return false;

  //filter out jokers and sort the cards
  let jokers: Card[] = [];
  let jokerlessCards = cards;
  if (jokerNumber!=false) [jokerlessCards, jokers] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  //check that each (non-joker) card's number is the same
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
function filterJokers(cards: Card[], jokerNumber: (keyof typeof numbers|false)=false){
  let jokers: Card[] = [];
  let jokerlessCards: Card[] = [];

  if (jokerNumber!=false){
    jokerlessCards = cards.filter(card => {
      if (card.number==jokerNumber) {
        jokers.push(card);
        return false;
      }
      return true;
    } 
    )
  }

  jokerlessCards.sort(Card.compareCardsNumberFirst);
  return [jokerlessCards, jokers];
}
