/*
This function checks an array of cards if it can form a valid meld.
The cards are not sorted, and are checked in the given order.

For cases where order isn't relevant, see validateAndSortMeld.
*/
export function validateMeldInGivenOrder(cards, jokerNumber = false, maxSetSize = 4) {
    if (cards.length >= 3 && (checkForSequence(cards, jokerNumber) || checkForSet(cards, jokerNumber, maxSetSize))) {
        return true;
    }
    return false;
}
function checkForSequence(cards, jokerNumber = false) {
    let isValid = true;
    //if the meld starts with jokers, we must start loop at the first actual card
    let startIndex = 1;
    while (cards[startIndex - 1].number == jokerNumber && cards[startIndex].number == jokerNumber)
        startIndex++;
    let curJokerChainCount = 0; //if we have chain of jokers in between 2 actual cards, this is the no. of jokers,
    let curFirstCardInJokerChain = cards[startIndex].cardValueSuitFirst(); //and this is the 1st actual card's value
    for (let i = startIndex; i < cards.length; i++) {
        //current card is joker, so its start/part of a joker chain
        if (cards[i].number == jokerNumber) {
            curJokerChainCount++;
            if (curFirstCardInJokerChain != 0 && cards[i - 1].number != jokerNumber) {
                curFirstCardInJokerChain = cards[i - 1].cardValueSuitFirst();
            }
            continue;
        }
        //current card is not a joker, so check that card before is adjacent,
        //or if the joker chain is valid
        else {
            let currentCardValue = cards[i].cardValueSuitFirst();
            let prevCardValue;
            //if prev. card is joker, see if its a joker chain OR the meld just starts with joker(s)
            if (cards[i - 1].number == jokerNumber) {
                if (curFirstCardInJokerChain != currentCardValue)
                    prevCardValue = curFirstCardInJokerChain;
                else
                    continue;
            }
            else
                prevCardValue = cards[i - 1].cardValueSuitFirst();
            let difference = currentCardValue - prevCardValue;
            //if we can't account for sequence-adjacency with jokers in-between, invalid sequence
            if (difference != 1 + curJokerChainCount) {
                isValid = false;
                break;
            }
            //else the adjacent cards are still sequence-adjacent, so reset joker chain variables
            else {
                curJokerChainCount = 0;
                curFirstCardInJokerChain = currentCardValue;
            }
        }
    }
    return isValid;
}
function checkForSet(cards, jokerNumber = false, maxSetSize = 4) {
    if (cards.length > maxSetSize)
        return false;
    //just loop through and check for all same card numbers OR joker numbers
    let cardNo = cards[0].number;
    for (let i = 1; i < cards.length; i++) {
        if (cards[i].number != cardNo || cards[i].number != jokerNumber)
            return false;
    }
    return true;
}
