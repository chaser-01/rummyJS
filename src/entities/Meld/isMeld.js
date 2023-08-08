import { Card } from "../PokerDeck/Card.js";

/**
 * Checks if an array of cards forms a valid meld - ie, a set or sequence.
 * @param {Card[]} cards 
 * @param {string} jokerNumber - Optional joker that can replace any card in the meld
 * @param {int} maxSetSize - Optional max limit for the size of a set; defaults to 4
 * @returns 
 */
export function isMeld(cards, jokerNumber=0, maxSetSize=4) {

    if (Array.isArray(cards) && cards.length>=3 && (isValidSequence(cards, jokerNumber) || isValidSet(cards, jokerNumber, maxSetSize))) {
      return true;
    } else {
      return false;
    }
  }


/**
 * Checks if an array of cards forms a valid sequence.
 * @param {Card[]} cards 
 * @param {string} jokerNumber 
 * @returns {boolean}
 */
function isValidSequence(cards, jokerNumber=0) {
  //filter out jokers and sort the cards
  let jokerCount=0;
  let jokerlessCards=cards;
  if (jokerNumber!=0) [jokerlessCards, jokerCount] = filterJokers(cards, jokerNumber);
  jokerlessCards.sort(Card.compareCardsNumberFirst);

  let isValid = true;

  for (let i=0; i<jokerlessCards.length; i++){
    if (i==0) continue;

    //calculate adjacent cards' values (increasing suits -> +100, increasing numbers -> +1)
    const currentCardValue = jokerlessCards[i].cardValueSuitFirst();
    const prevCardValue = jokerlessCards[i-1].cardValueSuitFirst();
    let difference = currentCardValue - prevCardValue;

    //while 2 cards aren't adjacent numbers and same suit, use 1 joker (decrement jokerCount)
    while (difference>1 && jokerCount>0){
      difference--;
      jokerCount--;
    }
    //if the gap can't be filled by jokers, it isn't a valid sequence, so return false
    if (jokerCount<=0 && difference>1){
      isValid = false;
      break;
    }
  }
  return isValid;
}


/**
 * Checks if an array of cards forms a valid set.
 * @param {Card[]} cards 
 * @param {string} jokerNumber 
 * @param {int} maxSetSize 
 * @returns {boolean}
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
