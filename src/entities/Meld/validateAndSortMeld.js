import { Card } from "../PokerDeck/Card.js";

//Auxiliary functions for checking and sorting a meld. These are used in the Meld class


/**
 * Validates an array of cards as a meld, and sorts the cards into the valid meld in-place.
 * @param {Card[]} cards 
 * @param {string} jokerNumber - Optional joker that can replace any card in the meld
 * @param {int} maxSetSize - Optional max limit for the size of a set; defaults to 4
 * @returns 
 */
export function validateAndSortMeld(cards, jokerNumber=0, maxSetSize=4) {
  if (Array.isArray(cards) && cards.length>=3 && (isValidSequence(cards, jokerNumber) || isValidSet(cards, jokerNumber, maxSetSize))) {
    return true;
  } else {
    return false;
  }
}



/**
 * Checks if an array of cards forms a valid sequence, ie adjacent numbers and same suits.
 * If valid, sorts the array to form the sequence.
 * @param {Card[]} cards 
 * @param {string} jokerNumber 
 * @returns {boolean}
 */
function isValidSequence(cards, jokerNumber=0) {
  //filter out jokers and sort the cards
  let jokers = [];
  let jokerlessCards = cards;
  let sortedCards = jokerlessCards;
  if (jokerNumber!=0) [jokerlessCards, jokers] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  let isValid = true;
  let sortedOffset = 0;
  
  //check adjacent cards for same suit and adjacent number; while not the case, slot in a joker
  for (let i=0; i<jokerlessCards.length; i++){
    if (i==0) continue;

    const currentCardValue = jokerlessCards[i].cardValueSuitFirst();
    const prevCardValue = jokerlessCards[i-1].cardValueSuitFirst();
    let difference = currentCardValue - prevCardValue;

    //when we slot in a joker, offset the index in sortedCards by +1
    while (difference>1 && jokers.length>0){
      difference--;
      sortedCards.splice(i+sortedOffset, 0, jokers.splice(0, 1));
      sortedOffset++;
    }

    //if a gap can't be filled by jokers, cards don't form a valid sequence
    if (jokers.length<=0 && difference>1){
      isValid = false;
      break;
    }
  }

  //if its a valid sequence, replace the cards with sorted cards
  if (isValid) cards = sortedCards;
  return isValid;
}


/**
 * Checks if an array of cards forms a valid set, ie all same numbers.
 * If valid, sorts the array to form the set.
 * @param {Card[]} cards 
 * @param {string} jokerNumber 
 * @param {int} maxSetSize 
 * @returns {boolean}
 */
function isValidSet(cards, jokerNumber=0, maxSetSize=4) {
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
function filterJokers(cards, jokerNumber=this.jokerNumber){
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
