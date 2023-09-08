import { Meld } from "./Meld";
import { Card } from "../PokerDeck/Card";
/** Helper function; returns a new shuffled array. */
function shuffleArr(arr) {
    let shuffledArr = arr;
    shuffledArr.sort((a, b) => Math.random() > 0.5 ? 1 : -1);
    return shuffledArr;
}
describe('Meld', () => {
    describe('should initialize a sequence', () => {
        test('if the cards form one', () => {
            //longest possible sequence
            let cards = [
                new Card("Clubs", "Ace"),
                new Card("Clubs", "Two"),
                new Card("Clubs", "Three"),
                new Card("Clubs", "Four"),
                new Card("Clubs", "Five"),
                new Card("Clubs", "Six"),
                new Card("Clubs", "Seven"),
                new Card("Clubs", "Eight"),
                new Card("Clubs", "Nine"),
                new Card("Clubs", "Ten"),
                new Card("Clubs", "Jack"),
                new Card("Clubs", "Queen"),
                new Card("Clubs", "King")
            ];
            expect(new Meld(cards).cards).toEqual(cards);
        });
        test('even if the order is wrong, and sort it', () => {
            let cards = [
                new Card("Clubs", "Ace"),
                new Card("Clubs", "Two"),
                new Card("Clubs", "Three"),
                new Card("Clubs", "Four"),
                new Card("Clubs", "Five"),
                new Card("Clubs", "Six"),
                new Card("Clubs", "Seven"),
                new Card("Clubs", "Eight"),
                new Card("Clubs", "Nine"),
                new Card("Clubs", "Ten"),
                new Card("Clubs", "Jack"),
                new Card("Clubs", "Queen"),
                new Card("Clubs", "King")
            ];
            expect(new Meld(shuffleArr(cards)).cards).toEqual(cards);
        });
        test('with enough printed jokers or wildcards to fill any gaps', () => {
            //missing 6 of clubs, at index 3
            let initialCards = [
                new Card("Clubs", "Two"),
                new Card("Clubs", "Three"),
                new Card("Clubs", "Four"),
                new Card("Clubs", "Five"),
                new Card("Clubs", "Seven"),
                new Card("Clubs", "Eight"),
                new Card("Clubs", "Nine"),
                new Card("Clubs", "Ten")
            ];
            let cardsWithJoker = initialCards.splice(3, 0, new Card("Joker", "Joker"));
            let cardsWithWildcard = initialCards.splice(3, 0, new Card("Spades", "King"));
            expect(new Meld(shuffleArr(cardsWithJoker), "Joker").cards).toEqual(cardsWithJoker);
            expect(new Meld(shuffleArr(cardsWithWildcard), "King").cards).toEqual(cardsWithWildcard);
        });
        test('even with more than the required amount of jokers/wildcards', () => {
            //4 of clubs replaced by joker, as well as 3 additional jokers
            let cards = [
                new Card("Clubs", "Three"),
                new Card("Joker", "Joker"),
                new Card("Clubs", "Five"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker")
            ];
            expect(new Meld(cards, "Joker").cards).toEqual(cards);
        });
        test('regardless of maxSetSize (since it is not a set)', () => {
            let cards = [
                new Card("Clubs", "Ace"),
                new Card("Clubs", "Two"),
                new Card("Clubs", "Three"),
                new Card("Clubs", "Four")
            ];
            expect(new Meld(cards, undefined, 0).cards).toEqual(cards);
        });
    });
    describe('should not initialize a sequence', () => {
        test("if the cards don't form one", () => {
            //missing 4 of hearts
            let cards = [
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three"),
                new Card("Hearts", "Five")
            ];
            //4 of spades has wrong suit
            let cards2 = [
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three"),
                new Card("Spades", "Four")
            ];
            expect(new Meld(cards).cards).toEqual([]);
            expect(new Meld(cards2).cards).toEqual([]);
        });
        test("if gaps in sequence can't be filled by jokers/wildcards", () => {
            //gap from 3 to 7, but only 2 jokers present (3 are required)
            let cards = [
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three"),
                new Card("Hearts", "Seven"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker")
            ];
            expect(new Meld(cards, "Joker").cards).toEqual([]);
        });
    });
    describe('should initialize a set', () => {
        test('if the cards form one', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Ace")
            ];
            expect(new Meld(cards).cards).toEqual(cards);
        });
        test("if number of cards don't exceed maxSetSize", () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Ace"),
                new Card("Spades", "Ace")
            ];
            expect(new Meld(cards, undefined, 8).cards).toEqual(cards);
        });
        test('even if the order is wrong, and sort it', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Ace")
            ];
            expect(new Meld(shuffleArr(cards)).cards).toEqual(cards);
        });
        test('with enough printed jokers or wildcards to fill any gaps', () => {
            //minimum set size is 3, so missing 1
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Spades", "Ace")
            ];
            let cardsWithJoker = cards.splice(1, 0, new Card("Joker", "Joker"));
            let cardsWithWildcard = cards.splice(1, 0, new Card("Spades", "King"));
            expect(new Meld(cardsWithJoker, "Joker").cards).toEqual(cardsWithJoker);
            expect(new Meld(cardsWithWildcard, "King").cards).toEqual(cardsWithWildcard);
        });
        test('even with just 1 non-joker/wildcard', () => {
            let cards = [
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Hearts", "Ace")
            ];
            expect(new Meld(cards, "Joker", 8).cards).toEqual(cards);
        });
    });
    describe('should not initialize a set', () => {
        test("if the cards don't form one", () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Two")
            ];
            expect(new Meld(cards).cards).toEqual([]);
        });
        test("if cards form one, but size exceeds maxSetSize", () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Ace"),
                new Card("Spades", "Ace")
            ];
            expect(new Meld(cards, undefined, 7).cards).toEqual([]);
        });
    });
    describe('card addition (without specific index)', () => {
        let sequence = [
            new Card("Hearts", "Ace"),
            new Card("Hearts", "Two"),
            new Card("Hearts", "Three")
        ];
        test('should be successful if added card is valid', () => {
            let addedCard = new Card("Hearts", "Four");
            let meld = new Meld([...sequence]);
            meld.addCard(addedCard);
            expect(meld.cards).toEqual(sequence.concat(addedCard));
        });
        test('should be successful if added card is joker/wildcard', () => {
            let wildcard = new Card("Spades", "King");
            let meld = new Meld([...sequence], "King");
            meld.addCard(wildcard);
            expect(meld.cards).toEqual(sequence.concat(wildcard));
        });
        test('should be unsuccessful if added card is invalid', () => {
            let meld = new Meld([...sequence]);
            meld.addCard(new Card("Hearts", "Five"));
            expect(meld.cards).toEqual(sequence);
        });
        test('should be unsuccessful if meld is a set, and modified cards exceed maxSetSize', () => {
            let set = [
                new Card("Hearts", "Ace"),
                new Card("Diamonds", "Ace"),
                new Card("Clubs", "Ace"),
                new Card("Spades", "Ace")
            ];
            let meld = new Meld(set);
            let addedCard = new Card("Hearts", "Ace"); //would be a valid addition if maxSetSize weren't considered
            meld.addCard(addedCard);
            expect(meld.cards).toEqual(set);
        });
    });
    describe('card addition (with specific index)', () => {
        let sequence = [
            new Card("Hearts", "Ace"),
            new Card("Hearts", "Two"),
            new Card("Hearts", "Three")
        ];
        test('should be successful given valid card and position', () => {
            let addedCard = new Card("Hearts", "Four");
            let meld = new Meld(sequence);
            expect(meld.addCardSpecific(addedCard, 3)).toEqual(true);
            expect(meld.cards).toEqual([...sequence, addedCard]);
        });
        test('should be unsuccessful given a valid card but wrong position', () => {
            let addedCard = new Card("Hearts", "Four");
            let meld = new Meld(sequence);
            expect(meld.addCardSpecific(addedCard, 1)).toEqual(false);
            expect(meld.cards).toEqual(sequence);
        });
    });
    describe('card replacement (with specific index)', () => {
        let testCards = [
            new Card("Hearts", "Ace"),
            new Card("Joker", "Joker"),
            new Card("Hearts", "Three")
        ];
        describe('should be successful', () => {
            test('if replacing card and index is valid', () => {
                let cards = [...testCards];
                let meld = new Meld(cards, "Joker");
                let replacingCard = new Card("Hearts", "Two");
                meld.replaceCard(replacingCard, 1);
                let expectedCards = [...cards];
                expectedCards.splice(1, 1, replacingCard);
                expect(meld.cards).toEqual(expectedCards);
            });
            test('and return the replaced card', () => {
                let cards = [...testCards];
                let meld = new Meld(cards, "Joker");
                let replacingCard = new Card("Hearts", "Two");
                expect(meld.replaceCard(replacingCard, 1)).toEqual(cards[1]);
            });
        });
        describe('should be unsuccessful', () => {
            test('if replacing card is invalid', () => {
                let cards = [...testCards];
                let meld = new Meld(cards, "Joker");
                let replacingCard = new Card("Spades", "Two"); //wrong suit
                expect(meld.replaceCard(replacingCard, 1)).toEqual(false);
            });
            test('if replacing card is valid, but specified index is invalid', () => {
                let cards = [...testCards];
                let meld = new Meld(cards, "Joker");
                let replacingCard = new Card("Hearts", "Two");
                expect(meld.replaceCard(replacingCard, 0)).toEqual(false);
            });
        });
    });
    describe('card replacement (without specific index)', () => {
        test('should be successful if replacing card is valid at any place', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Joker", "Joker"),
                new Card("Hearts", "Three")
            ];
            let meld = new Meld(cards, "Joker");
            let replacingCard = new Card("Hearts", "Two");
            expect(meld.replaceAnyJoker(replacingCard)).toEqual(cards[1]);
        });
        test('should be successful even with multiple jokers/wildcards present', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Joker", "Joker"),
                new Card("Hearts", "Five")
            ];
            let meld = new Meld(cards, "Joker");
            let replacingCard = new Card("Hearts", "Three");
            expect(meld.replaceAnyJoker(replacingCard)).toEqual(cards[2]);
        });
        test('should be unsuccessful if replacing card is invalid', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Joker", "Joker"),
                new Card("Hearts", "Three")
            ];
            let meld = new Meld(cards);
            let replacingCard = new Card("Spades", "Two");
            expect(meld.replaceAnyJoker(replacingCard)).toEqual(false);
        });
        test('should be unsuccessful if no jokers/wildcards are present', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ];
            let meld = new Meld(cards);
            let replacingCard = new Card("Hearts", "Four");
            expect(meld.replaceAnyJoker(replacingCard)).toEqual(false);
        });
    });
    describe('string representation', () => {
        test('should be correct', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ];
            let meld = new Meld(cards);
            expect(`${meld}`).toEqual('♥A,♥2,♥3');
        });
    });
});
